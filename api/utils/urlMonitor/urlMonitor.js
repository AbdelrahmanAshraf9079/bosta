import urlmon from "url-monitor";
import getServerResponseTime from "get-server-response-time";
import check from "../../models/check.js";
import User from "../../models/user.js";
import { pushoverNotification } from "../pushover/pushover.js";
import {sendEmail} from "../emailSender.js"


const getResponseTime = async (url) => {
  try {
    return await getServerResponseTime(url);
  } catch (e) {
    console.log(e);
  }
};

const availabilityPercentage = (uptime, downtime) => {
  var availability = (uptime / uptime + downtime) * 100;
  return `${availability}%`;
};

const formatReport = (
  data,
  status,
  availabilityPercent,
  outages,
  downtime,
  uptime,
  responseTime,
  check
) => {
  data.status = status;
  data.availability = availabilityPercent;
  data.outages = outages;
  data.uptime = uptime;
  data.downtime = downtime;
  data.responseTime = responseTime;
  const log = {
    status : status,
    responseTime : responseTime,
    timestamp : Date.now(),
  }
  data.history = check.report ? [...check.report.history, log] : [log]
  return data;
};

const saveCreatedCheck = async (check, report, userId,website,firstTime) => {
  try {
    check.report = report;
  //save Check to database
  const savedCheck = await check.save();
  //get check by id
  const user = await User.findById(userId);
  // {
  //   $addToSet: { checkIds: savedCheck.id },
  // }
  const c = user.checkIds.includes(savedCheck.id)
  if(!c && firstTime){
    website.stop() //the channel is down
  }else{
    if(user.checkIds.indexOf(savedCheck.id) === -1  ){
      user.checkIds.push(savedCheck.id) //if the id is unique
    }
    await user.save({checkIds: savedCheck.id})
  }
  } catch (error) {
    throw (error)
  }
};

const sendNotification = (url,oldStatus, newStatus) => {
  if (oldStatus != newStatus) {
    const message = `${url} is ${newStatus} right now`;
    pushoverNotification(message);
  }
};

export const monitor = async (
  url,
  interval,
  timeout,
  check,
  userId,
  outages,
  uptime,
  downtime,
  firstTime
) => {

  if(firstTime) firstTime = false;
  var report;
  var website = new urlmon({
    url: url,
    interval: interval,
    timeout: timeout,
  });

  await website.on("error" || "unavailable", async (data) => {
    try {
      downtime += interval + timeout;
      outages++;
      var status = "unavailable";
      var ap = availabilityPercentage(uptime, downtime); //calculates availability percentage
      var responseTime = 0; //get response time
      report = formatReport(
        data,
        status,
        ap,
        outages,
        downtime,
        uptime,
        responseTime,
        check
      );
      if ( check.report?.status === "available" ) {
        sendNotification(url,check.report.status, status);
        const user = await User.findById(userId)
        sendEmail(user.email, user.id,`URL ${url} went down`)
      }

      saveCreatedCheck(check, report, userId,website,firstTime);
    } catch (e) {
      console.log(e);
    }
  });

  await website.on("available", async (data) => {
    try {
      uptime += interval;
      var status = "available";
      var ap = availabilityPercentage(uptime, downtime);
      var responseTime = await getResponseTime(website.url);
      report = formatReport(
        data,
        status,
        ap,
        outages,
        downtime,
        uptime,
        responseTime,
        check
      );
      if ( check.report?.status === "unavailable" ) {
        sendNotification(url,check.report.status, status);
        const user = await User.findById(userId)
        sendEmail(user.email, user.id,`URL ${url} is available now`)
      }
      saveCreatedCheck(check, report, userId,website,firstTime).then().catch((err)=>{
        website.stop()
      } );
    } catch (e) {
      console.log(e);
    }
  });
  website.start();
};

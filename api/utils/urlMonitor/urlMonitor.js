import urlmon from "url-monitor";
import getServerResponseTime from "get-server-response-time";
import check from "../../models/check.js";
import User from "../../models/user.js";

const getResponseTime = async (url) => {
  return await getServerResponseTime(url);
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
  responseTime
) => {
  data.status = status;
  data.availability = availabilityPercent;
  data.outages = outages;
  data.uptime = uptime;
  data.downtime = downtime;
  data.responseTime = responseTime;
  return data;
};

const saveCreatedCheck = async (check, report,userId) => {
  check.report = report;
  //save Check to database
  const savedCheck = await check.save();
  //get check by id
 await User.findByIdAndUpdate(userId, {
    $addToSet: { checkIds: savedCheck.id },
  });
  console.log("name =" + check.name + "  uptime = " + report.uptime)
};


export const monitor = async (url, interval, timeout, check ,userId,outages,uptime,downtime) => {
  var report;
  var website = new urlmon({
    url: url,
    interval: interval,
    timeout: timeout,
  });

  await website.on("error" || "unavailable", async (data) => {
    downtime += interval + timeout;
    outages++;
    var status = "unavailable";
    var ap = availabilityPercentage(uptime, downtime); //calculates availability percentage
    var responseTime = await getResponseTime(url); //get response time
    report = formatReport(
      data,
      status,
      ap,
      outages,
      downtime,
      uptime,
      responseTime
    );
    saveCreatedCheck(check, report,userId);
  });

  await website.on("available", async (data) => {
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
      responseTime
    );

    saveCreatedCheck(check, report,userId);
  });
  website.start();
};

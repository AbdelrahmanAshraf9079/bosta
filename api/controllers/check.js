import Check from "../models/check.js";
import User from "../models/user.js";
import { monitor } from "../utils/urlMonitor/urlMonitor.js";

//CREATE Check
export const createCheck = async (req, res, next) => {
  const newCheck = new Check(req.body);
  const outages = 0;
  const downtime = 0;
  const uptime = 0;

  try {
    await monitor(
      newCheck.url,
      newCheck.interval,
      newCheck.timeout,
      newCheck,
      req.body.userId
      ,outages,downtime,uptime
    );

    res.status(200).json("Check created successfully");
  } catch (err) {
    next(err);
  }
};

//UPDATE Check
export const updateCheck = async (req, res, next) => {
  try {
    const updatedCheck = await Check.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCheck);
  } catch (err) {
    next(err);
  }
};

//DELETE Check
export const deleteCheck = async (req, res, next) => {
  const checkId = req.params.id;
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $pull: { checkIds: checkId },
    });
    await Check.findByIdAndDelete(checkId);
    res.status(200).json("Check has been deleted");
  } catch (err) {
    next(err);
  }
};

//GET Check
export const getCheck = async (req, res, next) => {
  try {
    const check = await Check.findById(req.params.id);
    res.status(200).json(check);
  } catch (err) {
    next(err);
  }
};

// //GET check : check ? by tags
// export const getCheckByTag = async (req, res, next)=>{
//     const tag = req.body.tag
//     try{
//         // const check = await Check.find(req.params.id)
//         // res.status(200).json(check);
//     }catch(err){
//         next(err);
//     }
//     }

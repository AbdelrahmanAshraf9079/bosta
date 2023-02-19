import Check from "../models/check.js";
import user from "../models/user.js";

//CREATE Check
export const createCheck = async (req, res, next) => {
  const newCheck = new Check(req.body);
  try {
    //save Check to database
    const savedCheck = await newCheck.save();
    //get user by id
    await user.findByIdAndUpdate(req.body.userId, {
      $push: { checkIds: savedCheck.id },
    });
    res.status(200).json(savedCheck);
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
  const checkId = req.params.id
  try {
    await user.findByIdAndUpdate(req.body.userId, {
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

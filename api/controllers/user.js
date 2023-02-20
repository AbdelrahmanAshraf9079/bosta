import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailsender.js";
import check from "../models/check.js";

// CREATE new User
export const register = async (req, res, next) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    console.log();
    sendEmail(newUser.email, newUser.id, "Email Verification");
    await newUser.save();
    res.status(200).send(newUser);
  } catch (err) {
    next(err);
  }
};

//LOGIN User
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    if (user.verified == false) {
      res.status(403).send({
        message : "Please verify your user first"
      });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.JWT);

      const { password, ...otherDetails } = user._doc;
      const body = { ...otherDetails };
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ body });
    }
  } catch (err) {
    next(err);
  }
};

//VERIFY email
export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  // Verifying the JWT token
  jwt.verify(token, "SecretKey", async function (err, decoded) {
    const id = decoded.id;
    if (err) {
      console.log(err);
      res.send(
        "Email verification failed,possibly the link is invalid or expired"
      );
    } else {
      const user = await User.findByIdAndUpdate(id, { verified: true });
      res.send("Your Email was successfully verified");
      next();
    }
    next();
  });
};

//GET User
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//DELETE user
export const deleteUser = async (req, res, next) => {
  try {
    const userChecks = await User.findById(req.params.id).select("checkIds");
    await check.deleteMany({
      _id: {
        $in: userChecks.checkIds,
      },
    });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    next(err);
  }
};

//GET ALL User
export const getUsers = async (req, res, next) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  } catch (err) {
    next(err);
  }
};

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";


export const sendEmail = (email, id,subject,text="") => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.senderEmail,
      pass: process.env.generatedPassword,
    },
  });
  const token = jwt.sign(
    {
      email: email,
      id: id
    },
    "SecretKey",
    { expiresIn: "10m" }
  );
  let sender = "Bosta Monitoring API";
  const mailConfigurations = {
    // It should be a string of sender/server email
    from: sender,
    to: email,

    // Subject of Email
    subject: subject,
    // This would be the text of email body
    text: subject === "Email Verification" ? `Hi! There, You have recently created a new user and entered your email.
                  Please follow the given link to verify your email
                  http://localhost:8800/user/verify/${token}
                  Thanks` : text,
  };

  //The sendMail method of the transporter object simply sends the mail to the given address
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("Email Sent Successfully");
  });
};

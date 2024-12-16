import { EMAIL_PASS, EMAIL_USER } from "../secrets";

const nodemailer = require("nodemailer");

export const sendResetPasswordEmail = async (email:string, token:any) => {
  const resetLink = `http://loacalhost:8000/api/auth/resetpassword?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass:EMAIL_PASS || "flnu rjrs rzni bwbg",
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested to reset your password. Click the link below to reset it:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>This link is valid for 5 minutes.</p>`,
  });
};

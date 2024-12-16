import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { compareSync, hashSync, hash } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

import { badRequestError } from "../utils/badRequest";
import { ErrorCode } from "../utils/root";
import { generateResetPasswordToken } from "../middleware/sendmail";
import { sendResetPasswordEmail } from "../utils/nodemailer";

export const sendMail = async (req: Request, res: Response) => {
  const { email } = req.body;

  let user = prisma.user.findFirst({ where: { email } });
  if (!email) {
    throw new badRequestError( "Email is required", 404);
  }

  const token = generateResetPasswordToken(user);
  try {
    await sendResetPasswordEmail(email, token);
    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    let user = await prisma.user.findFirst({ where: { email } });

    if (user) {
      next(
        new badRequestError(
          "can not register user with this email",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.json({
      message: "user is registered",
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new Error("can not find user with this email");
    }

    if (!compareSync(password, user.password)) {
      throw new Error("Invaild email or password");
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token);
    res.json({
      message: "user is registered",
      user: {
        email,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: (decoded as jwt.JwtPayload).userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

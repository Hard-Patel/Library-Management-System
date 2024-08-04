import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "../client/prisma";

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("access_token");
  if (!token) {
    return res.send({
      message: "Access token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "");

    const User = await prismaClient.user.findUnique({
      // @ts-ignore
      where: { email: String(decoded?.email) || "" },
    });

    if (User && User.email) {
      req.body["user"] = User;
      console.log('req["user"]: ', req?.body.user, User);
      next();
    } else {
      throw new Error("Invalid User token");
    }
  } catch (e) {
    return res.send({
      message: "Invalid access token",
    });
  }
};

export { authentication };

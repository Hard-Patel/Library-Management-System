import { Request, Response } from "express";
import { prismaClient } from "../../client/prisma";
import {
  DefaultArgs,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { IAddUserRequest, IUpdateUserRequest } from "../../interface/user";
import { mapUpdatedUser } from "../../utils/users";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

const SALT_ROUNDS = 10;

export const loginUserFromDB = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  try {
    const User = await prismaClient.user.findUnique({
      where: { email: String(email) },
    });

    if (User) {
      const isMatch = await bcrypt.compare(String(password), User?.password);

      if (isMatch) {
        var token = jwt.sign(
          { email: User.email, id: User.id },
          process.env.SECRET_KEY || ""
        );

        response.send({
          message: "Users logged in successfully",
          data: { ...User, login_token: token },
        });
      } else {
        response.send({
          message: "Invalid credentials or User does not exists.",
          data: {},
        });
      }
    } else {
      response.send({
        message: "Invalid credentials or User does not exists.",
        data: {},
      });
    }
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const getUsersFromDB = async (request: Request, response: Response) => {
  const { sortBy, page, size, search = "" } = request.query;
  try {
    const query: Prisma.UserFindManyArgs<DefaultArgs> = {
      include: {
        books: true,
      },
    };

    if (Number(page) && Number(size)) {
      query["skip"] = Number(size) * (Math.max(Number(page), 1) - 1);
    }
    if (Number(sortBy)) {
      query["orderBy"] = { id: sortBy === "2" ? "desc" : "asc" };
    }
    if (Number(size) > 0) {
      query["take"] = Number(size);
    } else {
      query["take"] = 10;
    }
    if (search) {
      query["where"] = {
        OR: [
          {
            firstName: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: String(search),
              mode: "insensitive",
            },
          },
        ],
      };
    }

    const Users = await prismaClient.user.findMany(query);

    response.send({
      message: Users.length
        ? "Users list fetched successfully"
        : "No users found",
      data: Users || [],
    });
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const getUserDetailsFromDB = async (
  request: Request,
  response: Response
) => {
  const {
    user: { id: user_id },
  } = request.body;
  try {
    if (!Number(user_id)) {
      throw new Error("User Id is required");
    }
    const Books = await prismaClient.user.findUnique({
      where: { id: Number(user_id) },
      include: {
        books: {
          where: {
            Transaction: {
              every: {
                isDue: true,
              },
            },
          },
        },
        Transaction: {
          include: {
            book: true,
          },
        },
        _count: {
          select: {
            Transaction: {
              where: {
                isDue: false,
              },
            },
            books: true,
          },
        },
      },
    });

    // @ts-ignore
    const { _count, ...rest } = Books;

    response.send({
      message: Books ? "User details found successfully" : "User not found",
      data: {
        ...rest,
        total_dues: _count.Transaction || 0,
        total_books: _count.books || 0,
      },
    });
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const addUserToDB = async (request: Request, response: Response) => {
  try {
    const { email, first_name, last_name, password } =
      request.body as IAddUserRequest;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const User = await prismaClient.user.create({
      data: {
        email: email,
        firstName: first_name,
        lastName: last_name,
        password: hashedPassword,
      },
    });

    response.send({
      message: "User created successfully",
      data: User,
    });
  } catch (error: any) {
    console.log("e: ", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint failed
        response.status(400).json({
          message: "User already exist.",
          error: "Unique constraint failed",
          details: error.meta,
        });
      } else if (error.code === "P2003") {
        // Foreign key constraint failed
        response.status(400).json({
          error: "Foreign key constraint failed",
          details: error.meta,
        });
      } else {
        response
          .status(500)
          .json({ error: "Database error", details: error.message });
      }
    } else {
      // Handle other types of errors
      response.status(500).send({
        message: "Internal server error",
        data: {},
      });
    }
  }
};

export const updateUserToDB = async (request: Request, response: Response) => {
  try {
    const { user_id, password } = request.body as IUpdateUserRequest;
    const mappedUpdated = mapUpdatedUser(request.body);

    if (password) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      mappedUpdated["password"] = hashedPassword;
    }

    const User = await prismaClient.user.update({
      where: { id: user_id },
      data: mappedUpdated,
    });

    response.send({
      message: "User updated successfully",
      data: User,
    });
  } catch (error: any) {
    console.log("e: ", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint failed
        response
          .status(400)
          .json({ error: "Unique constraint failed", details: error.meta });
      } else if (error.code === "P2003") {
        // Foreign key constraint failed
        response.status(400).json({
          error: "Foreign key constraint failed",
          details: error.meta,
        });
      } else {
        response
          .status(500)
          .json({ error: "Database error", details: error.message });
      }
    } else {
      // Handle other types of errors
      response.status(500).send({
        message: "Internal server error",
        data: {},
      });
    }
  }
};

export const deleteUserFromDB = async (user_id: number, response: Response) => {
  try {
    const User = await prismaClient.user.delete({
      where: { id: user_id },
    });

    response.send({
      message: "User deleted successfully",
      data: { user_id },
    });
  } catch (error: any) {
    // Handle other types of errors
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

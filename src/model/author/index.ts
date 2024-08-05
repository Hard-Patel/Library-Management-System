import { Request, Response } from "express";
import { prismaClient } from "../../client/prisma";
import {
  DefaultArgs,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { IAddUserRequest, IUpdateUserRequest } from "../../interface/user";
import { mapUpdatedUser } from "../../utils/users";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { IAddAuthor, IUpdateAuthorRequest } from "../../interface/author";
import { mapUpdatedAuthor } from "../../utils/author";
require("dotenv").config();

export const getAuthorsFromDB = async (
  request: Request,
  response: Response
) => {
  const { sortBy, page, size, search = "" } = request.query;
  try {
    const query: Prisma.AuthorFindManyArgs<DefaultArgs> = {
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
            name: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            books: {
              some: {
                title: {
                  contains: String(search),
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      };
    }

    const Authors = await prismaClient.author.findMany(query);

    response.send({
      message: Authors.length
        ? "Authors list fetched successfully"
        : "No authors found",
      data: Authors || [],
    });
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const getAuthorDetailsFromDB = async (
  request: Request,
  response: Response
) => {
  const { author_id } = request.params;
  try {
    if (!Number(author_id)) {
      throw new Error("User Id is required");
    }
    const Author = await prismaClient.author.findUnique({
      where: { id: Number(author_id) },
      include: {
        books: true,
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    // @ts-ignore
    const { _count = { books: 0 }, ...rest } = Author || {};

    response.send({
      message: Author
        ? "Author details found successfully"
        : "Author not found",
      data: Author
        ? {
            ...rest,
            total_books: _count.books || 0,
          }
        : {},
    });
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const addAuthorToDB = async (request: Request, response: Response) => {
  try {
    const { birth_date, name } = request.body as IAddAuthor;

    const Author = await prismaClient.author.create({
      data: {
        name,
        birthDate: birth_date,
      },
    });

    response.send({
      message: "Author created successfully",
      data: Author,
    });
  } catch (error: any) {
    console.log("e: ", error);
    // Handle other types of errors
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const updateAuthorToDB = async (
  request: Request,
  response: Response
) => {
  try {
    const { author_id } = request.body as IUpdateAuthorRequest;
    const mappedUpdated = mapUpdatedAuthor(request.body);

    const Author = await prismaClient.author.update({
      where: { id: author_id },
      data: mappedUpdated,
    });

    if (Author) {
      response.send({
        message: "Author updated successfully",
        data: Author || {},
      });
    } else {
      response.status(400).send({
        message: "Author does not exist",
        data: {},
      });
    }
  } catch (error: any) {
    console.log("e: ", error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.log("error.code: ", error.code);
      if (error.code === "P2025") {
        // Invalid author
        response
          .status(400)
          .json({ error: "Author does not exist", details: error.meta });
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

export const deleteAuthorFromDB = async (
  author_id: number,
  response: Response
) => {
  try {
    const User = await prismaClient.author.delete({
      where: { id: author_id },
    });

    response.send({
      message: "Author deleted successfully",
      data: { author_id },
    });
  } catch (error: any) {
    // Handle other types of errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Invalid author
        response
          .status(400)
          .json({ error: "Author does not exist", details: error.meta });
      }
    } else {
      response.status(500).send({
        message: error.message || "Internal server error",
        data: {},
      });
    }
  }
};

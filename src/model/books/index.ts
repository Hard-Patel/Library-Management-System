import { Request, Response } from "express";
import { prismaClient } from "../../client/prisma";
import {
  IAddBookRequest,
  IAddMultipleBookRequest,
  IUpdateBookRequest,
} from "../../interface/book";
import { mapMultipleBooksData, mapUpdatedData } from "../../utils/books";
import { Prisma } from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";

export const getBookFromDB = async (request: Request, response: Response) => {
  const { sortBy, page, size, search = "" } = request.query;
  try {
    const query: Prisma.BookFindManyArgs<DefaultArgs> = {};

    if (Number(page) && Number(size)) {
      query["skip"] = Number(size) * (Math.max(Number(page), 1) - 1);
    }
    if (Number(sortBy)) {
      query["orderBy"] = { id: sortBy === "2" ? "desc" : "asc" };
    }
    if (Number(size) > 0) {
      query["take"] = Number(size);
    }
    if (search) {
      query["where"] = {
        OR: [
          {
            title: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            isbn: {
              contains: String(search),
              mode: "insensitive",
            },
          },
        ],
      };
    }

    const Books = await prismaClient.book.findMany(query);

    response.send({
      message: Books.length
        ? "Books list fetched successfully"
        : "Books list not present",
      data: Books || [],
    });
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const getBookDetailsFromDB = async (
  request: Request,
  response: Response
) => {
  const { book_id } = request.params;
  try {
    if (!Number(book_id)) {
      throw new Error("Book Id is required");
    }
    const Books = await prismaClient.book.findUnique({
      where: { id: Number(book_id) },
    });

    response.send({
      message: Books ? "Book details found successfully" : "Book not found",
      data: Books || {},
    });
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

export const addBookToDB = async (request: Request, response: Response) => {
  try {
    const { title, isbn, author_birth_date, publish_date, author_name } =
      request.body as IAddBookRequest;

    const Book = await prismaClient.book.create({
      data: {
        title,
        isbn,
        publishedDate: publish_date,
        authors: {
          create: {
            name: author_name,
            birthDate: author_birth_date,
          },
        },
      },
    });

    response.send({
      message: "Book added successfully",
      data: Book,
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

export const addMultipleBookToDB = async (
  request: Request,
  response: Response
) => {
  try {
    const books: Prisma.BookCreateManyInput[] = mapMultipleBooksData(
      request.body as IAddMultipleBookRequest[]
    );

    const Books = await prismaClient.book.createMany({
      data: books,
    });

    response.send({
      message: "Books added successfully",
      data: books,
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

export const updateBookToDB = async (request: Request, response: Response) => {
  try {
    const { book_id } = request.body as IUpdateBookRequest;
    const mappedUpdated = mapUpdatedData(request.body);

    const Book = await prismaClient.book.update({
      where: { id: book_id },
      data: mappedUpdated,
    });

    response.send({
      message: "Book updated successfully",
      data: Book,
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

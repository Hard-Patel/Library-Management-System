import { Request, Response } from "express";
import { prismaClient } from "../../client/prisma";
import {
  IAddBookRequest,
  IAddMultipleBookRequest,
  IUpdateBookRequest,
} from "../../interface/book";
import { mapMultipleBooksData, mapUpdatedData } from "../../utils/books";
import { Prisma } from "@prisma/client";

export const getBookFromDB = async (_: Request, response: Response) => {
  try {
    const Books = await prismaClient.book.findMany();

    response.send({
      message: "Books list fetched successfully",
      data: Books,
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
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
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
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
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
  } catch (e: any) {
    console.log("e: ", e);
    response.status(500).send({
      message: "Internal server error",
      data: {},
    });
  }
};

import { Request, Response } from "express";
import { validateAddBook, validateAddMultipleBooks, validateUpdateBook } from "../../validators/books";
import { addBookToDB, addMultipleBookToDB, getBookFromDB, updateBookToDB } from "../../model/books";

export const getBook = async (request: Request, response: Response) => {
  await getBookFromDB(request, response);
};

export const addBook = async (request: Request, response: Response) => {
  const valid = validateAddBook(request.body);

  if (valid.success) {
    await addBookToDB(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

export const addMultipleBook = async (request: Request, response: Response) => {
  const valid = validateAddMultipleBooks(request.body);

  if (valid.success) {
    await addMultipleBookToDB(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

export const updateBook = async (request: Request, response: Response) => {
  const valid = validateUpdateBook(request.body);

  if (valid.success) {
    await updateBookToDB(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

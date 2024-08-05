import { Request, Response } from "express";
import { validateAssignBook, validateReturnBook } from "../../validators/transactions";
import { assignBookToUser, returnBookFromUser } from "../../model/transactions";

export const assignBook = async (request: Request, response: Response) => {
  const valid = validateAssignBook(request.body);

  if (valid.success) {
    await assignBookToUser(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

export const returnBook = async (request: Request, response: Response) => {
  const valid = validateReturnBook(request.body);

  if (valid.success) {
    await returnBookFromUser(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

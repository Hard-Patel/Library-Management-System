import { Request, Response } from "express";
import {
  validateAssignBook,
  validateReturnBook,
} from "../../validators/transactions";
import { assignBookToUser, getTransactionsFromDB, returnBookFromUser } from "../../model/transactions";
import { IGetTransactionsRequest } from "../../interface/transactions";

export const getTransactions = async (request: Request, response: Response) => {
  const { all, due } = request.query as IGetTransactionsRequest;

  try {
    await getTransactionsFromDB({ all, due, user: request.body.user }, response);
  } catch (error: any) {
    console.log("error: ", error);
    response.status(500).send({
      message: error?.message || "Internal server error",
      error: error,
    });
  }
};

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

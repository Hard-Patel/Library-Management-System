import { Request, Response } from "express";
import { assignBookTransaction } from "./assign";
import { returnBookTransaction } from "./return";
import { IReturnBookRequest } from "../../interface/transactions";

export const assignBookToUser = async (
  request: Request,
  response: Response
) => {
  try {
    const { book_id, user, assign_time, return_time } = request.body;

    const Transaction = await assignBookTransaction({
      assign_time,
      book_id,
      return_time,
      user_id: user.id,
    });

    response.send({
      message: "Book assigned successfully!",
      data: { transaction: Transaction },
    });
  } catch (error: any) {
    console.log("e: ", error);
    // Handle other types of errors
    response.status(500).send({
      message: error?.message || "Internal server error",
      data: {},
    });
  }
};

export const returnBookFromUser = async (
  request: Request,
  response: Response
) => {
  try {
    const { transaction_id, return_date = new Date() } = request.body as IReturnBookRequest;

    const Transaction = await returnBookTransaction({
      transaction_id,
      return_date
    });

    response.send({
      message: "Book returned successfully!",
      data: { transaction: Transaction },
    });
  } catch (error: any) {
    console.log("e: ", error);
    // Handle other types of errors
    response.status(500).send({
      message: error?.message || "Internal server error",
      data: {},
    });
  }
};

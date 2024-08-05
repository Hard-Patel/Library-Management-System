import { Request, Response } from "express";
import { assignBookTransaction } from "./assign";
import { returnBookTransaction } from "./return";
import {
  IGetTransactionsRequest,
  IReturnBookRequest,
} from "../../interface/transactions";
import { prismaClient } from "../../client/prisma";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

export const getTransactionsFromDB = async (
  { all, due, user }: IGetTransactionsRequest & { user: any },
  response: Response
) => {
  try {
    const query: Prisma.TransactionFindManyArgs<DefaultArgs> = {
      include: {
        book: true,
      },
    };
    if (all !== "1") {
      query["where"] = {
        ...query["where"],
        userId: user.id,
      };
    }
    if (due === "1" || due === "2") {
      query["where"] = {
        ...query["where"],
        isDue: due === "1" ? true : false,
      };
    }
    console.log("query: ", query);
    const Transactions = await prismaClient.transaction.findMany(query);

    response.json({
      message: "Transactions fetched successfully!",
      data: {
        transaction: Transactions || [],
        total: Transactions.length || 0,
      },
    });
  } catch (error: any) {
    response.status(500).send({
      message: error.message || "Internal server error",
      error,
    });
  }
};

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
    const { transaction_id, return_date = new Date() } =
      request.body as IReturnBookRequest;

    const Transaction = await returnBookTransaction({
      transaction_id,
      return_date,
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

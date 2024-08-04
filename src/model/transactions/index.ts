import { Request, Response } from "express";
import { prismaClient } from "../../client/prisma";
import {
  DefaultArgs,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { IAssignBookRequest } from "../../interface/transactions";

export const assignBookToUser = async (
  request: Request,
  response: Response
) => {
  try {
    const { book_id, user, assign_time, return_time } = request.body;

    const Transaction = await prismaClient.transaction.create({
      data: {
        bookId: book_id,
        userId: user.id,
        checkoutDate: assign_time || new Date(),
        isDue: true,
        dueDate: return_time || null,
      },
    });

    const Book = await prismaClient.book.update({
      where: { id: book_id },
      data: {
        quantity: { decrement: 1 },
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    response.send({
      message: "Book assigned successfully!",
      // data: User,
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

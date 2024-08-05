import { prismaClient } from "../../client/prisma";

interface IAssignBookTransaction {
  book_id: number;
  user_id: number;
  return_time: Date;
  assign_time: Date;
}

export const assignBookTransaction = ({
  assign_time,  
  book_id,
  user_id,
  return_time
}: IAssignBookTransaction) => {
  return prismaClient.$transaction(async (tx) => {
    // 1. Decrement quantity from the book.
    const Book = await tx.book.update({
      where: { id: book_id },
      data: {
        quantity: { decrement: 1 },
        User: {
          connect: {
            id: user_id,
          },
        },
      },
    });

    // 2. Verify that the sender's balance didn't go below zero.
    if (Book.quantity < 0) {
      throw new Error(`${Book.title} is not available to assign.`);
    }

    // 3. Increment the recipient's balance by amount
    const Transaction = await tx.transaction.create({
      data: {
        bookId: book_id,
        userId: user_id,
        checkoutDate: assign_time || new Date(),
        isDue: true,
        dueDate: return_time || null,
      },
    });

    return Transaction;
  });
};

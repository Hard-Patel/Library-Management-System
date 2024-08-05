import { prismaClient } from "../../client/prisma";

interface IReturnBookTransaction {
  transaction_id: number;
  return_date: Date;
}

export const returnBookTransaction = ({
  transaction_id,
  return_date,
}: IReturnBookTransaction) => {
  return prismaClient.$transaction(async (tx) => {
    const ValidTransaction = await tx.transaction.findUnique({
      where: { id: transaction_id },
    });

    if (!ValidTransaction?.isDue) {
      throw new Error("Book already returned!");
    }
    // 1. Update the transaction due and return date
    const Transaction = await tx.transaction.update({
      where: {
        id: transaction_id,
      },
      data: {
        isDue: false,
        returnDate: return_date,
      },
    });
    console.log("Transaction: ", Transaction);

    // 1. Increment quantity from the book.
    const Book = await tx.book.update({
      where: { id: Transaction.bookId },
      data: {
        quantity: { increment: 1 },
      },
    });

    return Transaction;
  });
};

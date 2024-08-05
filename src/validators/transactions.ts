import { z } from "zod";
import { IAssignBookRequest, IReturnBookRequest } from "../interface/transactions";

export const validateAssignBook = (request: IAssignBookRequest) => {
  const schema = z.object({
    book_id: z.number(),
  });

  return schema.safeParse(request);
};

export const validateReturnBook = (request: IReturnBookRequest) => {
  const schema = z.object({
    transaction_id: z.number(),
    return_date: z.string().datetime().optional(),
  });

  return schema.safeParse(request);
};

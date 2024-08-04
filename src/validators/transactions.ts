import { z } from "zod";
import { IAssignBookRequest } from "../interface/transactions";

export const validateAssignBook = (request: IAssignBookRequest) => {
  const schema = z.object({
    book_id: z.number(),
  });

  return schema.safeParse(request);
};

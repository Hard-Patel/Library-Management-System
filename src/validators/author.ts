import z from "zod";
import { IAddAuthor, IUpdateAuthorRequest } from "../interface/author";

export const validateAddAuthor = (request: IAddAuthor) => {
  const schema = z.object({
    name: z.string(),
    birth_date: z.string().datetime(),
  });

  return schema.safeParse(request);
};

export const validateUpdateAuthor = (request: IUpdateAuthorRequest) => {
  const schema = z.object({
    name: z.string().optional(),
    birth_date: z.string().datetime().optional(),
    author_id: z.number(),
  });

  return schema.safeParse(request);
};

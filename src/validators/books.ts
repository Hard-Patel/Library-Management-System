import { z } from "zod";
import { IAddBookRequest, IUpdateBookRequest } from "../interface/book";

export const validateAddBook = (request: IAddBookRequest) => {
  const schema = z.object({
    title: z.string(),
    isbn: z.string(),
    publish_date: z.string().datetime(),
    author_name: z.string(),
    author_birth_date: z.string().datetime(),
  });

  return schema.safeParse(request);
};

export const validateAddMultipleBooks = (request: IAddBookRequest) => {
  const schema = z.array(
    z.object({
      title: z.string(),
      isbn: z.string(),
      publish_date: z.string().datetime(),
      author_id: z.number(),
    })
  );

  return schema.safeParse(request);
};

export const validateUpdateBook = (request: Partial<IUpdateBookRequest>) => {
  const schema = z.object({
    book_id: z.number(),
    title: z.string().optional(),
    isbn: z.string().optional(),
    publish_date: z.string().datetime().optional(),
    author_id: z.string().optional(),
  });

  return schema.safeParse(request);
};

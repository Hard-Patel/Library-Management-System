import { z } from "zod";
import { IAddUserRequest, ILoginUserRequest, IUpdateUserRequest } from "../interface/user";

export const validateLoginUser = (request: ILoginUserRequest) => {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  return schema.safeParse(request);
};

export const validateAddUser = (request: IAddUserRequest) => {
  const schema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    password: z.string(),
  });

  return schema.safeParse(request);
};

export const validateUpdateUser = (request: IUpdateUserRequest) => {
  const schema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    user_id: z.number(),
  });

  return schema.safeParse(request);
};

import _ from "lodash";
import { IUpdateBookRequest } from "../interface/book";
import { Prisma } from "@prisma/client";
import { IUpdateUserRequest } from "../interface/user";
import { updateKey } from "./common";

const allowedUpdates = ["first_name", "last_name", "email", "password"];
const mapAllowedUpdates: { [key: string]: any } = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  password: "password",
};

export const mapUpdatedUser = (data: IUpdateUserRequest) => {
  let validated = _.pickBy(
    data,
    (value, key) => allowedUpdates.includes(key) && value !== undefined
  );

  for (const key in validated) {
    validated = updateKey(validated, key, mapAllowedUpdates[key] || key);
  }
  return validated;
};

import _ from "lodash";
import { IUpdateBookRequest } from "../interface/book";
import { Prisma } from "@prisma/client";
import { IUpdateUserRequest } from "../interface/user";

const allowedUpdates = ["first_name", "last_name", "email", "password"];
const mapAllowedUpdates: { [key: string]: any } = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  password: "password",
};

function updateKey(
  obj: { [key: string]: any },
  oldKey: string,
  newKey: string
) {
  // Check if the old key exists in the object
  if (!_.has(obj, oldKey)) {
    return obj; // Return the original object if the old key does not exist
  }

  const value = obj[oldKey];
  const newObject = _.omit(obj, oldKey); // Create a new object without the old key
  return { ...newObject, [newKey]: value }; // Add the new key with its value
}

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

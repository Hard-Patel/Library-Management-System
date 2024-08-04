import _ from "lodash";
import {
  IAddBookRequest,
  IAddMultipleBookRequest,
  IUpdateBookRequest,
} from "../interface/book";
import { Prisma } from "@prisma/client";

const allowedUpdates = ["title", "isbn", "publish_date", "author_id"];
const mapAllowedUpdates: { [key: string]: any } = {
  title: "title",
  isbn: "isbn",
  publish_date: "publishedDate",
  author_id: "authorId",
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

export const mapUpdatedData = (data: IUpdateBookRequest) => {
  let validated = _.pickBy(
    data,
    (value, key) => allowedUpdates.includes(key) && value !== undefined
  );

  for (const key in validated) {
    validated = updateKey(validated, key, mapAllowedUpdates[key] || key);
  }
  return validated;
};

const mapAddBook: { [key: string]: any } = {
  title: "title",
  isbn: "isbn",
  publish_date: "publishedDate",
  author_id: "authorId",
};

function updateBookKeys(
  obj: IAddMultipleBookRequest,
  newKey: { [key: string]: string }
) {
  let validated = obj;

  for (const key in validated) {
    (validated as Partial<Prisma.BookCreateManyInput>) = updateKey(
      validated,
      key,
      newKey[key] || key
    );
  }

  return validated;
}

export const mapMultipleBooksData = (
  data: IAddMultipleBookRequest[]
): Prisma.BookCreateManyInput[] => {
  const mapped = data;
  for (let index = 0; index < mapped.length; index++) {
    let iterator = mapped[index];
    // @ts-ignore
    (mapped[index] as Prisma.BookCreateManyInput[]) = updateBookKeys(
      iterator,
      mapAddBook
    );
  }
  console.log("mapped: ", mapped);
  // @ts-ignore
  return mapped;
};

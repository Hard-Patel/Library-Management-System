import _ from "lodash";
import {
  IAddMultipleBookRequest,
  IUpdateBookRequest,
} from "../interface/book";
import { Prisma } from "@prisma/client";
import { updateKey } from "./common";

const allowedUpdates = [
  "title",
  "quantity",
  "isbn",
  "publish_date",
  "author_id",
];
const mapAllowedUpdates: { [key: string]: any } = {
  title: "title",
  quantity: "quantity",
  isbn: "isbn",
  publish_date: "publishedDate",
  author_id: "authorId",
};

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
  quantity: "quantity",
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

import { IUpdateAuthorRequest } from "../interface/author";
import { updateKey } from "./common";
import _ from "lodash";

const allowedUpdates = ["name", "birth_date"];
const mapAllowedUpdates: { [key: string]: any } = {
  name: "name",
  birth_date: "birthDate",
};

export const mapUpdatedAuthor = (data: IUpdateAuthorRequest) => {
  let validated = _.pickBy(
    data,
    (value, key) => allowedUpdates.includes(key) && value !== undefined
  );

  for (const key in validated) {
    validated = updateKey(validated, key, mapAllowedUpdates[key] || key);
  }
  return validated;
};

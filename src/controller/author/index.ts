import { Request, Response } from "express";
import { deleteUserFromDB, updateUserToDB } from "../../model/users";
import { validateUpdateUser } from "../../validators/users";
import {
  addAuthorToDB,
  deleteAuthorFromDB,
  getAuthorDetailsFromDB,
  getAuthorsFromDB,
  updateAuthorToDB,
} from "../../model/author";
import {
  validateAddAuthor,
  validateUpdateAuthor,
} from "../../validators/author";

export const getAuthors = async (request: Request, response: Response) => {
  try {
    await getAuthorsFromDB(request, response);
  } catch (error: any) {
    response.status(500).send({
      message: error.message || "Internal server error",
      error: error,
    });
  }
};

export const getAuthorDetails = async (
  request: Request,
  response: Response
) => {
  try {
    await getAuthorDetailsFromDB(request, response);
  } catch (error: any) {
    response.status(500).send({
      message: error.message || "Internal server error",
      error: error,
    });
  }
};

export const addAuthor = async (request: Request, response: Response) => {
  const valid = validateAddAuthor(request.body);

  try {
    if (valid.success) {
      await addAuthorToDB(request, response);
    } else {
      response.status(400).send({
        message: "Bad reqeust or invalid arguments",
        error: valid.error,
      });
    }
  } catch (error: any) {
    response.status(500).send({
      message: error.message || "Internal server error",
      error: valid.error,
    });
  }
};

export const updateAuthor = async (request: Request, response: Response) => {
  const valid = validateUpdateAuthor(request.body);

  if (valid.success) {
    await updateAuthorToDB(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

export const deleteAuthor = async (request: Request, response: Response) => {
  try {
    const { author_id } = request.params;
    if (author_id) {
      await deleteAuthorFromDB(Number(author_id), response);
    } else {
      response.status(400).send({
        message: "Bad reqeust or invalid arguments",
        error: "user does not exist",
      });
    }
  } catch (error: any) {
    response.status(500).send({
      message: error.message || "Internal server error",
      error,
    });
  }
};

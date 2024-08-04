import { Request, Response } from "express";
import {
  addUserToDB,
  deleteUserFromDB,
  getUserDetailsFromDB,
  getUsersFromDB,
  loginUserFromDB,
  updateUserToDB,
} from "../../model/users";
import {
  validateAddUser,
  validateLoginUser,
  validateUpdateUser,
} from "../../validators/users";

export const loginUser = async (request: Request, response: Response) => {
  const valid = validateLoginUser(request.body);

  if (valid.success) {
    await loginUserFromDB(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

export const getUsers = async (request: Request, response: Response) => {
  await getUsersFromDB(request, response);
};

export const getUserDetails = async (request: Request, response: Response) => {
  await getUserDetailsFromDB(request, response);
};

export const addUser = async (request: Request, response: Response) => {
  const valid = validateAddUser(request.body);

  if (valid.success) {
    await addUserToDB(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

export const updateUser = async (request: Request, response: Response) => {
  const valid = validateUpdateUser(request.body);

  if (valid.success) {
    await updateUserToDB(request, response);
  } else {
    response.status(400).send({
      message: "Bad reqeust or invalid arguments",
      error: valid.error,
    });
  }
};

export const deleteUser = async (request: Request, response: Response) => {
  try {
    const { user_id } = request.params;
    if (user_id) {
      await deleteUserFromDB(Number(user_id), response);
    } else {
      response.status(400).send({
        message: "Bad reqeust or invalid arguments",
        error: "user does not exist",
      });
    }
  } catch (e: any) {
    response.status(500).send({
      message: "Internal server error",
    });
  }
};

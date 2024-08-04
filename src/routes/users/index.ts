import express from "express";
import { UsersRoutes } from "../../constants/routes";
import {
  addUser,
  deleteUser,
  getUserDetails,
  getUsers,
  loginUser,
  updateUser,
} from "../../controller/users";
import { authentication } from "../../middleware/authentication";

const router = express.Router();

router.post(UsersRoutes.LoginUsers, loginUser);

router.get(UsersRoutes.GetUsers, getUsers);

router.get(UsersRoutes.GetUserDetails, [authentication], getUserDetails);

router.post(UsersRoutes.AddUser, addUser);

router.put(UsersRoutes.UpdateUser, updateUser);

router.delete(UsersRoutes.DeleteUser, deleteUser);

export { router as usersRouter };

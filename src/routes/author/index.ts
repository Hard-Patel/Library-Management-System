import express from "express";
import { AuthorRoutes } from "../../constants/routes";
import { authentication } from "../../middleware/authentication";
import {
  addAuthor,
  deleteAuthor,
  getAuthorDetails,
  getAuthors,
  updateAuthor,
} from "../../controller/author";

const router = express.Router();

router.get(AuthorRoutes.GetAuthors, getAuthors);

router.get(AuthorRoutes.GetAuthorDetails, getAuthorDetails);

router.post(AuthorRoutes.AddAuthor, [authentication], addAuthor);

router.put(AuthorRoutes.UpdateAuthor, [authentication], updateAuthor);

router.delete(AuthorRoutes.DeleteAuthor, [authentication], deleteAuthor);

export { router as authorRouter };

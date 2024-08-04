import express from "express";
import { addBook, addMultipleBook, getBook, updateBook } from "../../controller/books";
import { BooksRoutes } from "../../constants/routes";

const router = express.Router();

router.get(BooksRoutes.GetBooks, getBook);

router.post(BooksRoutes.AddBook, addBook);

router.post(BooksRoutes.AddMultipleBook, addMultipleBook);

router.post(BooksRoutes.UpdateBook, updateBook);

export { router as booksRouter };

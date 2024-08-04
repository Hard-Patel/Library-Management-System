import express from "express";
import { addBook, addMultipleBook, getBook, getBookDetails, updateBook } from "../../controller/books";
import { BooksRoutes } from "../../constants/routes";

const router = express.Router();

router.get(BooksRoutes.GetBooks, getBook);

router.get(`${BooksRoutes.GetBookDetails}/:book_id`, getBookDetails);

router.post(BooksRoutes.AddBook, addBook);

router.post(BooksRoutes.AddMultipleBook, addMultipleBook);

router.post(BooksRoutes.UpdateBook, updateBook);

export { router as booksRouter };

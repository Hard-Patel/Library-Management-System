import express from "express";
import { TransactionsRoutes } from "../../constants/routes";
import { assignBook, returnBook } from "../../controller/transactions";
import { authentication } from "../../middleware/authentication";

const router = express.Router();

router.post(TransactionsRoutes.AssignBook, [authentication], assignBook);

router.post(TransactionsRoutes.ReturnBook, [authentication], returnBook);

export { router as transactionsRouter };

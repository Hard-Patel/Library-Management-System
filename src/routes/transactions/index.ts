import express from "express";
import { TransactionsRoutes } from "../../constants/routes";
import { assignBook, getTransactions, returnBook } from "../../controller/transactions";
import { authentication } from "../../middleware/authentication";

const router = express.Router();

router.get(TransactionsRoutes.GetTransaction, [authentication], getTransactions);

router.post(TransactionsRoutes.AssignBook, [authentication], assignBook);

router.post(TransactionsRoutes.ReturnBook, [authentication], returnBook);

export { router as transactionsRouter };

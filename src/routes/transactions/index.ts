import express from "express";
import { TransactionsRoutes } from "../../constants/routes";
import { assignBook } from "../../controller/transactions";
import { authentication } from "../../middleware/authentication";

const router = express.Router();

router.post(TransactionsRoutes.AssignBook, [authentication], assignBook);

export { router as transactionsRouter };

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { booksRouter } from "./routes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { usersRouter } from "./routes/users";
import { transactionsRouter } from "./routes/transactions";
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

const port = process.env.PORT || 3000;

// Use the route handlers
app.use("/v1/books", booksRouter);
app.use("/v1/users", usersRouter);
app.use("/v1/transactions", transactionsRouter);

// Error handling middleware
app.use((req: Request, res: Response) => {
  console.log("res: ", res);
  res.json({ error: "Server error" });
});

app.listen(port, () => {
  console.log(`LBMS app listening at Port: ${port}`);
});

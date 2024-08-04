import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { booksRouter } from "./routes";
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

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`LBMS app listening at Port: ${port}`);
});

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { booksRouter } from "./routes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint failed
        res
          .status(400)
          .json({ error: "Unique constraint failed", details: err.meta });
        break;
      case "P2003":
        // Foreign key constraint failed
        res
          .status(400)
          .json({ error: "Foreign key constraint failed", details: err.meta });
        break;
      default:
        res.status(500).json({ error: "Database error", details: err.message });
        break;
    }
  } else {
    // Handle other types of errors
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

app.listen(port, () => {
  console.log(`LBMS app listening at Port: ${port}`);
});

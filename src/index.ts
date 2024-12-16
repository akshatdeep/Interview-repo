import express from "express";
import { PORT } from "./secrets";
import { PrismaClient } from "@prisma/client";
import rootRouter from "./routes/index.routes";
import { errorMiddleware } from "./middleware/error";
import cookieParser from "cookie-parser";

const app = express();

export const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

app.use("/api", rootRouter);
app.use(errorMiddleware);

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`connected to server port: ${PORT}`);
});

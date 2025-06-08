/** @format */
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import logger from "morgan";
import createError from "http-errors";
import fileUpload from "express-fileupload";
import mongoInit from "./configs/mongo.config";
import { kafkaInit } from "./configs/kafka.config";
import cloudinaryInit from "./configs/cloudinary.config";
import router from "./routes";

dotenv.config({ path: "./.env" });
mongoInit();
kafkaInit();
cloudinaryInit();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(
  fileUpload({
    useTempFiles: true, // Ensure the files are stored temporarily
    tempFileDir: "/tmp/", // Temp folder to store uploaded files
  })
);
app.use("/api/v1", router);

app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});
// Error message
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 401);
  res.send({
    error: {
      status: err.status || 401,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});

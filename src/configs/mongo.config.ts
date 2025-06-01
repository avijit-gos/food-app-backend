/** @format */

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import { DB_URL } from "../constants";

function mongoInit() {
  mongoose.connect(DB_URL);
  mongoose.connection.on("error", () => console.log("DB is not connected."));
  mongoose.connection.on("connected", () => console.log("DB is connected."));
}

export default mongoInit;

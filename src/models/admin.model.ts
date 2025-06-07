/** @format */

import mongoose from "mongoose";
import { AdminType } from "../interfaces/admin.types";

const AdminSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: {
      type: String,
      trim: true,
      require: [true, "Admin name is required"],
    },
    email: {
      type: String,
      trim: true,
      require: [true, "Admin email is required"],
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImg: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      require: [true, "Admin password is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Restriceted", "Delete"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model<AdminType>("Admin", AdminSchema);

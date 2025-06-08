/** @format */

import mongoose from "mongoose";
import { BannerType } from "../interfaces/banner.interface";

const BannerSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    image: { type: String, required: [true, "Banner image is required"] },
    url: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Delete"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model<BannerType>("Banner", BannerSchema);

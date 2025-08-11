/** @format */

import mongoose from "mongoose";
import FooterType from "../interfaces/footer.interface";

const FooterSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, trim: true },
    image: { type: String, trim: true },
    isOutside: { type: Boolean, default: true },
    link: { type: String },
    isSocial: { type: Boolean, default: true },
    isClickable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Delete"],
      default: "Active",
    },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<FooterType>("Footer", FooterSchema);

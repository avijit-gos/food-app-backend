/** @format */

import mongoose from "mongoose";
import TypeFoodCategory from "../interfaces/food-category.type";

const FoodCategorySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    image: {
      type: String,
      trim: true,
      required: [true, "Food category image is required"],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Food category name is required"],
    },
    url: {
      type: String,
      trim: true,
      required: [true, "Food category url is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending", "Delete"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model<TypeFoodCategory>(
  "FoodCategory",
  FoodCategorySchema
);

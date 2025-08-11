/** @format */

import mongoose, { Document } from "mongoose";
import { IFood } from "../interfaces/food.type";

const NutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, required: true }, // kcal
    fat: { type: Number, required: true }, // g
    carbohydrates: { type: Number, required: true }, // g
    protein: { type: Number, required: true }, // g
  },
  { _id: false }
);

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ExtraOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    nutrition: { type: NutritionSchema, required: false },
  },
  { _id: false }
);

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "biriyani",
        "buns",
        "burger",
        "cake",
        "cocktail",
        "fried-chicken",
        "croissant",
        "fries",
        "mushroom",
        "meat",
        "momo",
        "pizza",
        "ramen",
        "rice",
        "sushi",
        "vegan",
        "drinks",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable", "delete", "pending"],
      default: "available",
    },
    isVegan: { type: Boolean, default: false },
    price: { type: Number, required: true },
    nutrition: { type: NutritionSchema, required: true },
    ingredients: { type: String, required: true },
    image: { type: String, default: null },
    reviews: { type: [ReviewSchema], default: [] },
    addOns: { type: [ExtraOptionSchema], default: [] },
    suggestedPairings: [
      {
        name: { type: String, required: true },
        nutrition: { type: NutritionSchema, required: false },
      },
    ],
  },
  { timestamps: true }
);

FoodSchema.index({ category: 1 });

export default mongoose.model<IFood>("Food", FoodSchema);

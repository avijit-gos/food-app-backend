/** @format */

import { Document, Types } from "mongoose";

export interface INutrition {
  calories: number; // kcal
  fat: number; // g
  carbohydrates: number; // g
  protein: number; // g
}

export interface IReview {
  userId: Types.ObjectId;
  rating: number; // 1-5
  comment?: string;
  date?: Date;
}

export interface IExtraOption {
  name: string;
  price: number;
  nutrition?: INutrition;
}

export interface ISuggestedPairing {
  name: string;
  price?: number;
  nutrition?: INutrition;
}

export interface IFood extends Document {
  name: string;
  category:
    | "Biriyani"
    | "Buns"
    | "Burger"
    | "Cake"
    | "Cocktail"
    | "Fried Chicken"
    | "Croissant"
    | "Fries"
    | "Mushroom"
    | "Meat"
    | "Momo"
    | "Pizza"
    | "Ramen"
    | "Rice"
    | "Sushi"
    | "Vegan"
    | "Other";
  isVegan: boolean;
  status: "available" | "unavailable" | "delete" | "pending";
  price: number;
  size?: string; // e.g., "Regular", "Large"
  tags?: string[];
  nutrition: INutrition;
  ingredients: string[];
  image?: string;
  reviews?: IReview[];
  addOns?: IExtraOption[];
  suggestedPairings?: ISuggestedPairing[];
  createdAt?: Date;
  updatedAt?: Date;
}

/** @format */

import { Router } from "express";
import { validateAdminAuthentication } from "../middleware/admin.middleware";
import {
  createNewFoodItem,
  getFoodList,
  getFoodItemById,
  getFoods,
} from "../controllers/food.controller";

const FoodRoute = Router();

FoodRoute.post("/create", validateAdminAuthentication, createNewFoodItem);
FoodRoute.get("/list", validateAdminAuthentication, getFoodList);
FoodRoute.get("/food-item/:id", validateAdminAuthentication, getFoodItemById);
FoodRoute.get("/list-category/:foodCategory", getFoods);
export default FoodRoute;

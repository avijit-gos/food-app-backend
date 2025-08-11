/** @format */
import express from "express";
import { validateAdminAuthentication } from "../middleware/admin.middleware";
import {
  createNewFoodCategory,
  getAllFoodCategory,
  getAllActiveFoodCategory,
  updateCategoryStatus,
} from "../controllers/food-category.controller";

const router = express.Router();

router.post("/create", validateAdminAuthentication, createNewFoodCategory);
router.get("/lists", validateAdminAuthentication, getAllFoodCategory);
router.get("/active-list", getAllActiveFoodCategory);
router.patch(
  "/update-status/:id",
  validateAdminAuthentication,
  updateCategoryStatus
);

export default router;

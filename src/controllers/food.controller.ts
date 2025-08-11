/** @format */

import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import CustomRequestAdmins from "../interfaces/CustomRequestAdmins";
import fileUpload from "express-fileupload";
import { uploadImage } from "../utils";
import { FOOD_IMAGE } from "../constants";
import Food from "../models/food.model";
import mongoose from "mongoose";
import { IFood } from "../interfaces/food.type";
import foodCategoryModel from "../models/food-category.model";

export const createNewFoodItem = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    if (!req.body.name || !req.body.name.trim())
      throw next(createError.BadRequest("Food name is required"));
    if (!req.body.category || !req.body.category.trim())
      throw next(createError.BadRequest("Please select a food category"));
    if (Number(req.body.price) <= 0 || !req.body.price)
      throw next(createError.BadRequest("Invalid price for food"));

    let imageURL: string = "";
    if (req.files && req.files.image) {
      const image = req.files && (req.files.image as fileUpload.UploadedFile); // Type assertion
      imageURL = await uploadImage(image.tempFilePath, FOOD_IMAGE);
    }
    const newFood: IFood = new Food({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: imageURL,
      category: req.body.category,
      price: Number(req.body.price),
      ingredients: req.body.ingredients,
      nutrition: {
        calories: Number(req.body.calories),
        fat: Number(req.body.fat),
        carbohydrates: Number(req.body.carbohydrates),
        protein: Number(req.body.protein),
      },
      isVegan: req.body.isVegan ? req.body.isVegan : false,
    });
    console.log(newFood);
    const food = await newFood.save();
    return res
      .status(201)
      .json({ message: "A new food added", status: 201, food });
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error while create new banner")
    );
  }
};

export const getFoodList = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const statusFilter =
      typeof req.query.statusFilter === "string" &&
      req.query.statusFilter.trim() !== ""
        ? req.query.statusFilter
        : "";

    const categoryFilter =
      typeof req.query.categoryFilter === "string" &&
      req.query.categoryFilter.trim() !== ""
        ? req.query.categoryFilter
        : "";

    const operations: Record<string, any> = {};

    if (statusFilter) {
      operations.status = statusFilter;
    }
    if (categoryFilter) {
      operations.category = categoryFilter;
    }

    const foods: IFood[] = await Food.find(operations)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalDoc = await Food.countDocuments(operations);
    const totalPages = Math.ceil(totalDoc / limit);
    return res
      .status(200)
      .json({ message: "All food list fetch", food: foods, totalPages });
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error while create new banner")
    );
  }
};

export const getFoods = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const statusFilter = "available";

    if (!req.params.foodCategory) {
      throw next(createError.BadRequest("No food category found"));
    }

    if (req.params.foodCategory === "all") {
      const operations = {
        $and: [{ status: { $eq: statusFilter } }],
      };

      const foods = await Food.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const totalDoc = await Food.countDocuments(operations);
      const totalPages = Math.ceil(totalDoc / limit);
      return res.status(200).json({
        message: `Fetching foods from ${req.params.foodCategory} category`,
        status: 201,
        foods,
        totalPages,
      });
    } else {
      const category = await foodCategoryModel.findOne({
        url: `${req.params.foodCategory}`,
      });

      if (!category) {
        throw next(createError.BadRequest("Invalid food catgeory"));
      }
      if (category && category.status !== "Active") {
        throw next(createError.BadRequest("No food category found"));
      }
      const operations = {
        $and: [{ category: category.url }, { status: { $eq: statusFilter } }],
      };

      const foods = await Food.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const totalDoc = await Food.countDocuments(operations);
      const totalPages = Math.ceil(totalDoc / limit);
      return res.status(200).json({
        message: `Fetching foods from ${req.params.foodCategory} category`,
        status: 201,
        foods,
        totalPages,
      });
    }
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error while create new banner")
    );
  }
};

export const getFoodItemById = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    if (!req.params.id) throw next(createError.BadRequest("No food ID found"));
    const food = await Food.findById(req.params.id);

    if (!food) throw next(createError.BadRequest("No food data found"));

    return res
      .status(200)
      .json({ message: "Get food data", status: 200, food });
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error while create new banner")
    );
  }
};

/** @format */
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import CustomRequestAdmins from "../interfaces/CustomRequestAdmins";
import fileUpload from "express-fileupload";
import { uploadImage } from "../utils";
import { FOOD_CATEGORY_IMAGE } from "../constants";
import FoodCategory from "../models/food-category.model";
import mongoose from "mongoose";
import TypeFoodCategory from "../interfaces/food-category.type";

const CATEGORY_STATUS = ["Active", "Inactive", "Pending", "Delete"];

export const createNewFoodCategory = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    if (!req.body.name) {
      throw next(createError.BadRequest("Food category name not defined"));
    }

    const isFoodCategoryExists = await FoodCategory.findOne({
      name: req.body.name,
    }).select("name status");
    console.log(isFoodCategoryExists);

    if (
      isFoodCategoryExists &&
      isFoodCategoryExists.name === req.body.name &&
      isFoodCategoryExists.status !== "Delete"
    ) {
      throw next(createError.BadRequest("Food category already exists"));
    }

    const url: string = req.body.name.split(" ").join("-").toLowerCase();
    let imageURL: string = "";

    if (req.files && req.files.image) {
      const image = req.files.image as fileUpload.UploadedFile;
      imageURL = await uploadImage(image.tempFilePath, FOOD_CATEGORY_IMAGE);
    }

    const newFoodCategory = new FoodCategory({
      _id: new mongoose.Types.ObjectId(),
      image: imageURL,
      name: req.body.name,
      url: url,
    });

    const category = await newFoodCategory.save();

    return res.status(201).json({
      message: "A new food category added",
      status: 201,
      category,
    });
  } catch (error: any) {
    console.log(error);
    throw next(
      createError.BadRequest(
        error?.message || "Error while creating a new food category"
      )
    );
  }
};

export const getAllFoodCategory = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const filter =
      req.query.status !== "all"
        ? { $and: [{ status: req.query.status }] }
        : { status: { $ne: "Delete" } };
    const lists = await FoodCategory.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 });
    const totalDoc = await FoodCategory.countDocuments(filter);
    const totalPages = Math.ceil(totalDoc / limit);

    return res.status(200).json({
      message: "Fetch all food category",
      status: 200,
      categories: lists,
      totalPages,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error while creating a new food category"
      )
    );
  }
};

export const getAllActiveFoodCategory = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const lists = await FoodCategory.find({ status: { $ne: "Delete" } }).sort({
      name: 1,
    });

    return res.status(200).json({
      message: "Fetch all active food category",
      status: 200,
      categories: lists,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error while creating a new food category"
      )
    );
  }
};

export const updateCategoryStatus = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    if (!req.body.status)
      throw createError.BadRequest("No status data found in body");
    if (!CATEGORY_STATUS.includes(req.body.status))
      throw createError.BadRequest("No status data found");
    if (!req.params.id) throw createError.BadRequest("No category ID found");

    const data = await FoodCategory.findById(req.params.id).select("status");
    if (!data) throw createError.BadRequest("No status data found");
    if (data && data.status === "delete")
      throw createError.BadRequest(
        "Sorry this category has already been deleted"
      );
    if (data && data.status === req.body.status)
      throw createError.BadRequest("Sorry this status value already set");

    const updatedStatus = await FoodCategory.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    return res.status(200).json({
      message: "Food category status has been updated",
      status: 200,
      category: updatedStatus,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error while creating a new food category"
      )
    );
  }
};

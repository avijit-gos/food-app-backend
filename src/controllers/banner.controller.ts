/** @format */

import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import CustomRequestAdmins from "../interfaces/CustomRequestAdmins";
import fileUpload from "express-fileupload";
import { uploadImage } from "../utils";
import { BANNER_IMAGE } from "../constants";
import Banner from "../models/banner.model";
import mongoose from "mongoose";
import { BannerType } from "../interfaces/banner.interface";

const BANNER_STATUS = ["Active", "Inactive", "Pending", "Delete"];

export const createBanner = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    let imageURL: string = "";
    if (req.files && req.files.image) {
      const image = req.files && (req.files.image as fileUpload.UploadedFile); // Type assertion
      imageURL = await uploadImage(image.tempFilePath, BANNER_IMAGE);
    }

    const newBanner = new Banner({
      _id: new mongoose.Types.ObjectId(),
      image: imageURL,
      url: req.body.url ? req.body.url : "",
    });
    const banner: BannerType = await newBanner.save();
    return res
      .status(201)
      .json({ message: "A new banner has been created", status: 201, banner });
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error while create new banner")
    );
  }
};

export const getAllBanners = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const filter =
      req.query.filter !== "all"
        ? { $and: [{ status: req.query.status }] }
        : { status: { $ne: "Delete" } };

    const banners = await Banner.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalDoc = await Banner.countDocuments(filter);
    const totalPages = Math.ceil(totalDoc / limit);
    return res.status(200).json({
      message: "Fetch all banners",
      status: 200,
      banners: banners,
      totalPages,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error while cfetch all banners")
    );
  }
};

export const getActiveBanners = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const filter = { $and: [{ status: "Active" }] };

    const banners = await Banner.find(filter);

    return res.status(200).json({
      message: "Fetch all active banners",
      status: 200,
      banners: banners,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error while fetch active banners"
      )
    );
  }
};

export const updateBannerStatus = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    if (!req.params.id)
      throw next(createError.BadRequest("No banner ID is present"));
    if (!req.body.status)
      throw next(createError.BadRequest("No banner status provided"));
    if (!BANNER_STATUS.includes(req.body.status))
      throw next(createError.BadRequest("Invalid banner status"));

    const banner = await Banner.findById(req.params.id).select("status");
    if (!banner) throw next(createError.BadRequest("No banner data found"));
    if (banner.status === req.body.status)
      throw next(createError.BadRequest("Already same status set"));

    const updateBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    return res.status(200).json({
      message: "Banner status has been updated",
      status: 200,
      banner: updateBanner,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error while update banner status"
      )
    );
  }
};

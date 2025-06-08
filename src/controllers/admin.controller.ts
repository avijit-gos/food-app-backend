/** @format */

import Admin from "../models/admin.model";
import { AdminType } from "../interfaces/admin.types";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import {
  comparePassword,
  generateToken,
  hashUserPassword,
  uploadImage,
} from "../utils";
import mongoose from "mongoose";
import CustomRequestAdmins from "../interfaces/CustomRequestAdmins";
import fileUpload from "express-fileupload";
import { ADMIN_ACCOUNT_PROFILE_FOLDER } from "../constants";

const ADMIN_STATUS = ["Active", "Inactive", "Restriceted", "Delete"];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !name.trim())
      throw next(createError.BadRequest("Admin name is required"));
    if (!email) throw next(createError.BadRequest("Admin email is required"));
    if (!emailRegex.test(email.trim()))
      throw next(createError.BadRequest("Invalid email format"));
    if (!phone)
      throw next(createError.BadRequest("Admin phone number is required"));
    if (!phoneRegex.test(phone.trim()))
      throw next(createError.BadRequest("Invalid phone number format"));
    if (!password || !password.trim())
      throw next(createError.BadRequest("Admin password is required"));

    const isExists: AdminType | null = await Admin.findOne({
      $and: [{ email }],
    });
    if (isExists)
      throw next(
        createError.BadRequest("Admin already exists with same email")
      );

    // hash user password
    const hash = await hashUserPassword(password);
    if (!hash)
      throw next(createError.BadRequest("Could not hash user password"));
    const newAdmin = new Admin({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      phone,
      password: hash,
    });
    const admin = await newAdmin.save();

    // generate token
    const token: string | boolean = await generateToken(
      admin._id,
      admin.status
    );
    return res.status(201).json({
      message: "Admin register successfull",
      status: 201,
      admin,
      token,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error in admin registration")
    );
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const { email, password } = req.body;
    if (!email) throw next(createError.BadRequest("Admin email is required"));
    if (!emailRegex.test(email.trim()))
      throw next(createError.BadRequest("Invalid email format"));
    if (!password || !password.trim())
      throw next(createError.BadRequest("Admin password is required"));

    const isExists: AdminType | null = await Admin.findOne({
      $and: [{ email }],
    });
    if (!isExists)
      throw next(createError.BadRequest("No admin exists with this email"));

    // compare password
    const isPasswordCorrect = await comparePassword(
      isExists.password,
      password
    );
    if (!isPasswordCorrect)
      throw next(createError.BadRequest("Password is not correct"));

    // enerate token
    const token: string | boolean = await generateToken(
      isExists._id,
      isExists.status
    );

    return res.status(201).json({
      message: "Admin login successfull",
      status: 200,
      admin: isExists,
      token,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(error?.message || "Error in admin login")
    );
  }
};

export const getAdminProfile = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) throw next(createError.BadRequest("No admin profile found"));
    return res.status(201).json({
      message: "Successfull fetch admin profile",
      status: 200,
      admin,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error in fetching admin profile"
      )
    );
  }
};

export const updateAdminProfileStatus = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    if (!req.body.status)
      throw next(createError.BadRequest("No status data found"));

    if (!ADMIN_STATUS.includes(req.body.status))
      throw next(createError.BadRequest("Invalid status value"));

    const admin = await Admin.findById(req.admin._id).select("status");
    if (!admin) throw next(createError.BadRequest("No admin prprofile found"));
    if (admin && admin.status === req.body.status)
      throw next(createError.BadRequest("This status value previously set"));

    const updatedStatus = await Admin.findByIdAndUpdate(
      req.admin?._id,
      { $set: { status: req.body.status } },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      message: "Admin profile status has been updated",
      status: 200,
      admin: updatedStatus,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error in admin profile status update"
      )
    );
  }
};

export const updateAdminAccountDetails = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const adminData = await Admin.findById(req.admin?._id);
    if (!adminData)
      throw next(createError.BadRequest("No admin profile found"));
    if (req.body.email) {
      const isAlreadyExists = await Admin.find({
        $and: [{ email: req.body.email }],
      });
      if (isAlreadyExists)
        throw next(createError.BadRequest("Email already taken"));
    }

    const updatedProfile = await Admin.findByIdAndUpdate(
      req.admin?._id,
      {
        $set: {
          name: req.body.name || adminData.name,
          email: req.body.email || adminData.email,
        },
      },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      message: "Admin profile has been updated",
      status: 200,
      admin: updatedProfile,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error in admin profile details update"
      )
    );
  }
};

export const updateAdminProfileImage = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const admin = await Admin.findById(req.admin?._id).select("profileImg");
    if (!admin) throw next("No admin data found");
    let imageURL: string = "";
    if (req.files && req.files.image) {
      const image = req.files && (req.files.image as fileUpload.UploadedFile); // Type assertion
      imageURL = await uploadImage(
        image.tempFilePath,
        ADMIN_ACCOUNT_PROFILE_FOLDER
      );
    }
    const updateProfile = await Admin.findByIdAndUpdate(
      req.admin?._id,
      { $set: { profileImg: imageURL } },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      message: "Admin profile image has been updated",
      status: 200,
      admin: updateProfile,
    });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error in admin profile image update"
      )
    );
  }
};

export const updateAdminAccountPassword = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword)
      throw next(createError.BadRequest("Please provide old password"));
    if (!newPassword)
      throw next(createError.BadRequest("Please provide new password"));

    const admin = await Admin.findById(req.admin?._id).select("password");
    if (!admin) throw next("No admin data found");

    const isCorrectPassword = await comparePassword(
      admin.password,
      oldPassword
    );
    if (!isCorrectPassword)
      throw next(createError.BadRequest("Old password is not correct"));

    const hash = await hashUserPassword(newPassword);

    const updatedPassword = await Admin.findByIdAndUpdate(
      req.admin?._id,
      { $set: { password: hash } },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Passowrd successfully changed", status: 200 });
  } catch (error: any) {
    throw next(
      createError.BadRequest(
        error?.message || "Error in admin account password update"
      )
    );
  }
};

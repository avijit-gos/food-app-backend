/** @format */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ADMIN_TOKEN_KEY } from "../constants";
import { v2 as cloudinary } from "cloudinary";
import cloudinaryInit from "../configs/cloudinary.config";

export const hashUserPassword = async (
  userPassword: string
): Promise<string | boolean> => {
  try {
    const result = await bcrypt.hash(userPassword, 10);
    return result;
  } catch (error) {
    return false;
  }
};

export const generateToken = async (
  userId: string,
  userStatus: string
): Promise<string | boolean> => {
  try {
    const token: string = await jwt.sign(
      { _id: userId, status: userStatus },
      ADMIN_TOKEN_KEY,
      { expiresIn: "365d" }
    );
    return token;
  } catch (error) {
    return false;
  }
};

export const comparePassword = async (
  userPassword: string,
  password: string
): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(password, userPassword);
    return result;
  } catch (error) {
    return false;
  }
};

export const uploadImage = async (
  image: any,
  folderName: string
): Promise<void | any> => {
  const result = await cloudinary.uploader.upload(image, {
    folder: folderName,
  });
  const updatedUrl = result.url.replace(process.env.IMAGE_PATH as string, "");
  return updatedUrl;
};
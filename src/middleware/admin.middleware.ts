/** @format */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import CustomRequestAdmins from "../interfaces/CustomRequestAdmins";
import JwtPayload from "../interfaces/jwt.admins.payload";
import { ADMIN_TOKEN_KEY } from "../constants";

export const validateAdminAuthentication = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers["x-access-token"];

    if (Array.isArray(token)) {
      token = token[0]; // or throw an error if multiple tokens are invalid
    }

    if (!token || !token.trim()) {
      throw next(createError.BadGateway("No token found"));
    }
    const decoded = jwt.verify(token, ADMIN_TOKEN_KEY) as JwtPayload;
    if (decoded.status !== "Active")
      throw next(createError.BadGateway("permission denied"));
    req.admin = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

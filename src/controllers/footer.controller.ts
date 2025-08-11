/** @format */

import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import CustomRequestAdmins from "../interfaces/CustomRequestAdmins";
import FooterType from "../interfaces/footer.interface";
import Footer from "../models/footer.model";
import mongoose from "mongoose";

export const createFooterItem = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    if (!req.body.address || !req.body.address.trim()) {
      const newFooterItem = new Footer({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.body.image,
        isOutside: req.body.isOutside,
        isSocial: req.body.isSocial,
        isClickable: req.body.isClickable,
        link: req.body.link || `/${req.body.name.toLowerCase()}`,
      });
      const footerItem: FooterType | null = await newFooterItem.save();
      return res.status(201).json({
        message: "New footer item created",
        status: 201,
        footer: footerItem,
      });
    } else {
      const newFooterItem = new Footer({
        _id: new mongoose.Types.ObjectId(),
        address: req.body.address,
      });
      const footerItem: FooterType | null = await newFooterItem.save();
      return res.status(201).json({
        message: "New footer item created",
        status: 201,
        footer: footerItem,
      });
    }
  } catch (error: any) {
    return next(
      createError.BadRequest(
        error?.message || "Error while creating a new food category"
      )
    );
  }
};

export const getFooterItems = async (
  req: CustomRequestAdmins,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const getSocialQuery = { $and: [{ status: "Active" }, { isSocial: true }] };
    const getFooterQuery = {
      $and: [{ status: "Active" }, { isSocial: false }],
    };
    const socials = await Footer.find(getSocialQuery);
    const footers = await Footer.find(getFooterQuery);
    const address = socials.find((item) => item.address) || {};
    return res.status(200).json({
      message: "Fetch all footer items",
      status: 200,
      socials,
      footers,
      address,
    });
  } catch (error: any) {
    return next(
      createError.BadRequest(
        error?.message || "Error while creating a new food category"
      )
    );
  }
};

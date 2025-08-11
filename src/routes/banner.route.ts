/** @format */
import { Router } from "express";
import { validateAdminAuthentication } from "../middleware/admin.middleware";
import {
  createBanner,
  getActiveBanners,
  getAllBanners,
  updateBannerStatus,
} from "../controllers/banner.controller";

const BannerRoute = Router();

BannerRoute.post("/create", validateAdminAuthentication, createBanner);
BannerRoute.get("/lists", validateAdminAuthentication, getAllBanners);
BannerRoute.get("/lists-active", getActiveBanners);
BannerRoute.patch(
  "/update-status/:id",
  validateAdminAuthentication,
  updateBannerStatus
);

export default BannerRoute;

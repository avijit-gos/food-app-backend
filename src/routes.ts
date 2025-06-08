/** @format */

import { Router } from "express";
const router = Router();

import AdminRoute from "./routes/admin.route";
import BannerRoute from "./routes/banner.route";

router.use("/admins", AdminRoute);
router.use("/banners", BannerRoute);

export default router;

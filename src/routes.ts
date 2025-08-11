/** @format */

import { Router } from "express";
const router = Router();

import AdminRoute from "./routes/admin.route";
import BannerRoute from "./routes/banner.route";
import FoodCategoryroute from "./routes/food-catgeory-route";
import FooterRoute from "./routes/footer.route";
import FoodRoute from "./routes/food.route";

router.use("/admins", AdminRoute);
router.use("/banners", BannerRoute);
router.use("/food-catgeories", FoodCategoryroute);
router.use("/footers", FooterRoute);
router.use("/foods", FoodRoute);

export default router;

/** @format */

import { Router } from "express";
const router = Router();

import AdminRoute from "./routes/admin.route";

router.use("/admins", AdminRoute);

export default router;

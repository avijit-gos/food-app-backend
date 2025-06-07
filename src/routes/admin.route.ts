/** @format */

import { Router } from "express";
import {
  getAdminProfile,
  loginAdmin,
  registerAdmin,
  updateAdminAccountDetails,
  updateAdminProfileImage,
  updateAdminProfileStatus,
} from "../controllers/admin.controller";
import { validateAdminAuthentication } from "../middleware/admin.middleware";
const AdminRoute = Router();

AdminRoute.post("/register", registerAdmin);
AdminRoute.post("/login", loginAdmin);
AdminRoute.get("/profile", validateAdminAuthentication, getAdminProfile);
AdminRoute.patch(
  "/update-profile-status",
  validateAdminAuthentication,
  updateAdminProfileStatus
);
AdminRoute.put(
  "/update-profile",
  validateAdminAuthentication,
  updateAdminAccountDetails
);
AdminRoute.patch(
  "/update-profile-image",
  validateAdminAuthentication,
  updateAdminProfileImage
);

export default AdminRoute;

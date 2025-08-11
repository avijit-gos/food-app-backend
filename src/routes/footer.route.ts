/** @format */

import { Router } from "express";
import { validateAdminAuthentication } from "../middleware/admin.middleware";
import {
  createFooterItem,
  getFooterItems,
} from "../controllers/footer.controller";
const FooterRoute = Router();

FooterRoute.post("/create", validateAdminAuthentication, createFooterItem);
FooterRoute.get("/", getFooterItems);

export default FooterRoute;

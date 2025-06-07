/** @format */

import { Request } from "express";
interface CustomRequestAdmins extends Request {
  admin?: any;
}

export default CustomRequestAdmins;

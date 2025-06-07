/** @format */

interface JwtPayload {
  _id: string;
  status: string;
  iat: number;
  exp: number;
}

export default JwtPayload;

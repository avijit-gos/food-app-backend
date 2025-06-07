/** @format */

export type AdminType = {
  readonly _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImg: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
};

import { Request } from "express";

// Type extracted through access token payload
export interface SUser {
  id: string;
  username: string;
  email: string;
}

// Extended Request including the SUser
export interface SRequest extends Request {
  user?: SUser;
}

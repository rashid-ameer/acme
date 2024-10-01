import jwt from "jsonwebtoken";

export const generateAccessToken = (
  id: string,
  username: string,
  email: string
) => {
  return jwt.sign({ id, username, email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "15d",
  });
};

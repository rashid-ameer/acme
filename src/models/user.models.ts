import * as argon2 from "argon2";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isPasswordValid(password: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // if the user did not change password
  if (!this.isModified("password")) {
    return next();
  }

  // hash the new password and assign it to password field.
  // if successful move next
  // otherwise pass error to next middleware
  try {
    this.password = await argon2.hash(this.password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });

    // TODO: REMOVE IT LATER
    console.log(this.password);
    next();
  } catch (error: unknown) {
    next(error as mongoose.CallbackError);
  }
});

userSchema.methods.isPasswordValid = async function (password: string) {
  return await argon2.verify(this.password, password);
};

export const User = mongoose.model<IUser>("User", userSchema);

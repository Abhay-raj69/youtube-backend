import mongoose, { Schema } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // after doing index:true searching will be very easy
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// since encryption of the password takes time that's why we have used async before callback function
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    // if we will not introduce the above if condition then every time when user will change anything
    // and save it password will be encrypted again and again so to avoid that scenerio we have used the above if
    // statement
    this.password=bcrypt.hash(this.password,10)
    next()
})


export const User = mongoose.model("User", userSchema);

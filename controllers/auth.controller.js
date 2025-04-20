import { User } from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;
  if (!fullname || !username || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const existingUser = await User.findOne({ email, username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hasPassword = await bcrypt.hash(password, 10);
    if (!hasPassword) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const user = await User.create({
      fullname,
      username,
      email,
      password: hasPassword,
    });

    return res
      .status(202)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
  

    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    if (!token) {
      return res.status(500).json({ message: "Internal server errors" });
    }

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        message: "Login successful",
        success: true,
        token: token,
        data: {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        },
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server errors" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successful", success: true });
});

export const getLoginUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", user, success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

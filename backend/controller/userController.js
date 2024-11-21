import { Model } from "mongoose";
import { userModel } from "../model/userModel.js";
import {
  authenticateUser,
  generateToken,
  verifyToken,
} from "../jwt/JsonWebToken.js";
import express from "express";
const router = express.Router();

router.get("/fetch", authenticateUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_doc = await userModel.findById(user_id);
    return res.status(201).json({
      success: true,
      data: user_doc,
      message: "user fetched successfully",
    });
  } catch (err) {
    console.log("user controller ", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { user_name, phone_number, password } = req.body;
    //check if both are not null
    if (!user_name || !phone_number || !password) {
      return res
        .status(400)
        .json({ success: false, error: "enter all required details" });
    }
    //check if username not present already
    let db_response = await userModel.findOne({ phone_number });
    if (db_response) {
      return res.status(400).json({
        success: false,
        error: "user account is present already",
      });
    }

    const user = new userModel({ user_name, phone_number, password });
    db_response = await user.save();
    const token = generateToken(db_response._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "registration successful",
      data: {
        user_name: db_response.user_name,
        phone_number: db_response.phone_number,
        _id: db_response._id,
      },
    });
  } catch (err) {
    console.log("error in register", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    //check if both are not null
    if (!phone_number || !password) {
      return res
        .status(400)
        .json({ success: false, error: "invalid phone or password" });
    }
    //check if username not present already
    let db_response = await userModel.findOne({ phone_number });
    if (!db_response) {
      return res.status(400).json({
        success: false,
        error: "no user account is present",
      });
    }
    //use static method to verify password
    const password_status = await userModel.verifyPassword(
      password,
      db_response.password
    );

    if (password_status) {
      const token = generateToken(db_response._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      const { password, ...filtered_response } = db_response;
      return res.status(201).json({
        success: true,
        message: "login successful",
        data: {
          _id: db_response._id,
          phone_number: db_response.phone_number,
          user_name: db_response.user_name,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        error: "password is not matching",
      });
    }
  } catch (err) {
    console.log("error in register", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Clear the JWT cookie by setting an expired date
    res.clearCookie("token", {
      httpOnly: true, // Ensure the cookie is inaccessible via JavaScript
      secure: true, // Set to `true` in production (for HTTPS // Protect against CSRF
    });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.log("error in register", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

export { router as UserRouter };

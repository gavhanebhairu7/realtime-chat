import express from "express";
import { userModel } from "../model/userModel.js";

const contactRouter = express.Router();

contactRouter.get("/contacts", async (req, res) => {
  try {
    const user_id = req.user.id;
    if (!user_id) {
      console.log("no user id found");
      return res.status(501).json({
        success: false,
        error: "internal server error",
      });
    }
    const contact_list = await userModel
      .findById(user_id, "contacts")
      .populate("contacts", "user_name phone_number");

    if (!contact_list) {
      return res.status(501).json({
        success: true,
        data: [],
        message: "no contact are present",
      });
    }

    return res.status(201).json({
      success: true,
      data: contact_list.contacts,
      message: "contacts fetched successfully",
    });
  } catch (err) {
    console.log("contact controller :: ", err);
    return res.status(501).json({
      success: false,
      error: err,
    });
  }
});

contactRouter.post("/contacts", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { phone_number } = req.body;
    if (!phone_number) {
      return res.status(400).json({
        success: false,
        error: "bad request",
      });
    }
    const contact_id = await userModel.findOne({ phone_number }).select("_id");
    const user_document = await userModel.findById(user_id);
    if (!contact_id || !user_document) {
      return res.status(400).json({
        success: false,
        error: "user is not a member of this chat application, invite him",
      });
    }
    user_document.contacts = [...user_document.contacts, contact_id];
    const db_response = await user_document.save();
    return res.status(201).json({
      success: true,
      message: "contact saved to list",
      data: db_response.contacts,
    });
  } catch (err) {
    console.log("contact controller :: ", err);
    return res.status(501).json({
      success: false,
      error: err,
    });
  }
});

export { contactRouter };

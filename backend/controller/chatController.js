import express from "express";
import { userModel } from "../model/userModel.js";
import { chatModel } from "../model/chatModel.js";
import { messageModel } from "../model/messageModel.js";
const router = express.Router();

router.get("/chats", async (req, res) => {
  try {
    const user_id = req.user.id;
    const chatList = await userModel.findById(user_id, "chats").populate({
      path: "chats",
      populate: { path: "participants", model: "users" }, // Populate participants within chats
    });
    if (!chatList) {
      return res.status(201).json({
        success: true,
        data: [],
        message: "no chats found, create one",
      });
    }
    return res.status(201).json({
      success: true,
      data: chatList.chats,
      message: "chats fetched sucessfully",
    });
  } catch (err) {
    console.log("chat controller :: ", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

router.post("/newchat", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { chat_name, chat_type, participants } = req.body;
    let db_response;
    if (chat_type === "personal") {
      const chat_document = new chatModel({
        chat_name: "personal",
        admins: [user_id],
        chat_type: "personal",
        participants: [...participants, user_id],
        messages: [],
      });
      db_response = await chat_document.save();
    } else if (chat_type === "group") {
      const chat_document = new chatModel({
        chat_name: chat_name,
        admins: [user_id],
        chat_type: chat_type,
        participants: [...participants, user_id],
        messages: [],
      });
      db_response = await chat_document.save();
    }

    let user_doc = await userModel.findById(user_id);
    user_doc.chats = [...user_doc.chats, db_response._id];
    await user_doc.save();
    for (let i = 0; i < participants.length; i++) {
      let user_doc = await userModel.findById(participants[i]);
      if (!user_doc) continue;
      user_doc.chats = [...user_doc.chats, db_response._id];
      await user_doc.save();
    }
    return res.status(201).json({
      success: true,
      data: db_response,
      message: "chat created successfully",
    });
  } catch (err) {
    console.log("chat controller :: ", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

router.post("/chat/:chat_id", async (req, res) => {
  const user_id = req.user.id;
  const { chat_id } = req.params;
  const { contact_id } = req.body;
  if (!contact_id) {
    return res.status(400).json({
      success: false,
      error: "bad request",
    });
  }
  const chat_document = await chatModel.findById(chat_id);
  if (
    chat_document.admins.includes(user_id) &&
    !chat_document.participants.includes(contact_id)
  ) {
    chat_document.participants = [...chat_document.participants, contact_id];
    const db_response = await chat_document.save();
    return res.status(201).json({
      success: true,
      data: db_response,
      message: "member is added to conversation",
    });
  } else {
    return res.status(201).json({
      success: false,
      error: "cannot perform that action",
    });
  }
}); //contact:user_id
router.delete("/chat/:chat_id/:member_id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { member_id, chat_id } = req.params;
    //check if chat exists
    const chat_document = await chatModel.findById(chat_id);
    if (!chat_document) {
      return res.status(404).json({
        success: false,
        error: "chat doesn't exists",
      });
    }
    //check if type of chat is group
    if (chat_document.chat_type === "personal") {
      return res.status(400).json({
        success: false,
        error: "action cannot be performed",
      });
    }
    //check if current user is admin
    if (!chat_document.admins.includes(user_id)) {
      return res.status(402).json({
        success: false,
        error: "not authorised to do that !",
      });
    }
    //now remove the member from list
    //retrieve user_document of member ->remove chat_id from chats
    const member_document = await userModel.findById(member_id);
    member_document.chats = member_document.chats.filter(
      (chat) => !chat.equals(chat_document._id)
    );
    await member_document.save();
    //remove member from participants array
    chat_document.participants = chat_document.participants.filter(
      (user) => !user.equals(member_id)
    );
    //save chat_document
    const db_response = await chat_document.save();
    return res.status(201).json({
      success: true,
      data: db_response,
      message: "member removed from group",
    });
  } catch (err) {
    console.log("chat controller ", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

router.delete("/chat/:chat_id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { chat_id } = req.params;
    //get chat document
    const chat_document = await chatModel.findById(chat_id);
    if (!chat_document) {
      return res.status(404).json({
        success: false,
        error: "something went wrong",
      });
    }
    //check if user is admin
    if (!chat_document.admins.includes(user_id)) {
      return res.status(402).json({
        success: false,
        error: "you are not authorised",
      });
    }
    for (let i = 0; i < chat_document.participants.length; i++) {
      const member_doc = await userModel.findById(
        chat_document.participants[i]
      );
      if (!member_doc) continue;
      member_doc.chats = member_doc.chats.filter(
        (chat) => !chat.equals(chat_document._id)
      );
      await member_doc.save();
    }
    const admin_document = await userModel.findById(user_id);
    if (!admin_document) {
      return res.status(401).json({
        success: false,
        error: "unexpected error happened",
      });
    }
    admin_doc.chats = admin_doc.chats.filter(
      (chat) => !chat.equals(chat_document._id)
    );
    await admin_doc.save();
    //delete all the messages from chat_document
    for (let i = 0; i < chat_document.messages.length; i++) {
      let db_response = await messageModel.findByIdAndDelete(
        chat_document.messages[i]
      );
    }
  } catch (err) {
    console.log("chat controller ", err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});

export { router as chatRouter };

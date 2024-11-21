import express from "express";
import { chatModel } from "../model/chatModel.js";
import { messageModel } from "../model/messageModel.js";
import { userModel } from "../model/userModel.js";
const router = express.Router();

router.get("/messages/all", async (req, res) => {
  try {
    // Assuming userId is passed via authentication middleware
    const userId = req.user.id;

    // Fetch user's chats and populate messages
    const user = await userModel.findById(userId).populate({
      path: "chats",
      select: "messages", // Select only messages from the chat
      populate: {
        path: "messages",
        populate: {
          path: "sender",
          select: "user_name", // Populate sender with user_name
        },
      },
    });

    if (!user || !user.chats.length) {
      return res.status(404).json({
        success: false,
        error: "No chats found for this user",
      });
    }

    // Transform the chats into the desired response format
    const result = {};
    user.chats.forEach((chat) => {
      result[chat._id] = chat.messages || [];
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: "Messages fetched successfully for all chats",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.get("/messages/:chat_id", async (req, res) => {
  try {
    const { chat_id } = req.params;
    const messageList = await chatModel.findById(chat_id, "messages").populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "user_name", // Only select the user_name field
      },
    });

    return res.status(201).json({
      success: true,
      data: messageList.messages,
      message: "message fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({
      success: false,
      error: "internal server error",
    });
  }
});
router.post("/message/:chat_id", async (req, res) => {
  try {
    const user_id = req.user.id;
    const { chat_id } = req.params;
    const { message_body } = req.body;
    if (!message_body) {
      return res.status(400).json({
        success: false,
        error: "something went wrong",
      });
    }
    //create message, add ref in chat
    const msg_document = new messageModel({
      sender: user_id,
      deletedCount: 0,
      message_body: message_body,
    });
    let db_response = await msg_document.save();
    if (!db_response) {
      return res.status(400).json({
        success: false,
        error: "something went wrong",
      });
    }
    //get chat document and add message in chat
    const chat_document = await chatModel.findById(chat_id);
    chat_document.messages.push(db_response._id);
    db_response = await chat_document.save();
    return res.status(201).json({
      success: true,
      data: db_response,
      message: "message sent",
    });
  } catch (err) {
    console.log(err);
    return res.status(201).json({
      success: false,
      error: "internal server error",
    });
  }
}); //message body
router.put("/message/");
router.delete("/message/for_me/:message_id", async () => {});
router.delete("/message/for_all/:message_id", async () => {});

export { router as messageRouter };

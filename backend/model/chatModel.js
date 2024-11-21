import mongoose, { mongo } from "mongoose";

const chatSchema = new mongoose.Schema({
  chat_name: {
    type: String,
    required: true,
  },
  chat_type: {
    type: String,
    enum: ["personal", "group"],
    default: "personal",
  },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }],
});

const chatModel = mongoose.model("chats", chatSchema);

export { chatModel };

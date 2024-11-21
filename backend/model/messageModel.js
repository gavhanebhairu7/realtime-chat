import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  message_body: {
    type: String,
    required: true,
  },
  deletedCount: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date, // Use Date instead of Timestamp
    default: Date.now, // Automatically sets the current date/time
  },
  updated_at: {
    type: Date, // Use Date instead of Timestamp
    default: Date.now, // Automatically sets the current date/time
  },
});

// Automatically update `updated_at` before saving
msgSchema.pre("save", function (next) {
  const now = new Date();
  this.updated_at = now; // Update the timestamp
  if (!this.created_at) {
    this.created_at = now; // Set created_at only if not already set
  }
  next();
});

const messageModel = mongoose.model("messages", msgSchema);

export { messageModel };

import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  password: { type: String, required: true },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "chats" }],
  deletedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashed_password = bcrypt.hashSync(this.password, 10);
      this.password = hashed_password;
    } catch (err) {
      return next(err);
    }
  }
});

// Static method to verify password
userSchema.statics.verifyPassword = async function (
  inputPassword,
  storedHashedPassword
) {
  return await bcrypt.compare(inputPassword, storedHashedPassword);
};

const userModel = mongoose.model("users", userSchema);

export { userModel };

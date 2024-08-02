const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  linkId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

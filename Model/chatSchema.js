const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mechanics",
      required: true,
    },
    messages: [
      {
        text: {
          type: String,
          required: true,
        },
        senderType: {
          type: String,
          enum: ["user", "mechanics"],
          required: true,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "messages.senderType", // Corrected 'message' to 'messages'
        },
        receiverId:{
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "messages.senderType", // Corrected 'message' to 'messages'
        },
        is_read: {
          type: Boolean,
          default: false
      },
      read_at: {
          type: Date
      },
      timestamp: {
          type: Date,
          default: Date.now
      }

      },
    ],
  },
);

const ChatModel = mongoose.model("Chat", chatSchema);

module.exports = ChatModel;

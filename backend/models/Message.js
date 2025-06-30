import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
  },
  imageUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);

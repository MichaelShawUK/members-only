const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 50 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, maxLength: 200 },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);

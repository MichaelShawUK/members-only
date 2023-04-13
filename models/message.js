const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 50 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, maxLength: 200 },
  time: { type: Date, default: new Date() },
});

console.log(".......new message created");

MessageSchema.virtual("timestamp").get(function () {
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  return this.time.toLocaleDateString("en-GB", options);
});

module.exports = mongoose.model("Message", MessageSchema);

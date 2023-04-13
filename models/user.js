const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colour = function () {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30);
  const lightness = 40 + Math.floor(Math.random() * 20);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  colour: { type: String, default: colour },
});

// UserSchema.virtual("colour").get(function () {
//   const hue = Math.floor(Math.random() * 360);
//   const saturation = 70 + Math.floor(Math.random() * 30);
//   const lightness = 40 + Math.floor(Math.random() * 20);

//   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
// });

module.exports = mongoose.model("User", UserSchema);

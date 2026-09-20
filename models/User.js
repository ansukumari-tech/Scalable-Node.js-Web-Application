const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
 name: {
  type: String,
  required: true,
  trim: true,
  minlength: [2, "Name must be at least 2 characters"],
  maxlength: [80, "Name must be at most 80 characters"]
 },

 email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
 },

 password: {
  type: String,
  required: true,
  select: false
 }
},
{
 timestamps: true
}
);

userSchema.set("toJSON", {
 transform: (_doc, ret) => {
  delete ret.password;
  delete ret.__v;
  return ret;
 },
});

module.exports = mongoose.model("User", userSchema);
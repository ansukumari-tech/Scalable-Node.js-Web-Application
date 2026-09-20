const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res, next) => {
 try {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!name || !email || !password) {
   return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  if (password.length < 8) {
   return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }

  const existingUser = await User.findOne({ email }).select("_id").lean();

  if (existingUser) {
   return res.status(409).json({ success: false, message: "An account with this email already exists" });
  }

  const user = await User.create({
   name,
   email,
   password: await bcrypt.hash(password, 12)
  });

  res.status(201).json({
   success: true,
   message: "User registered successfully",
   data: { user }
  });

 } catch (error) {
  if (error?.code === 11000) {
   return res.status(409).json({ success: false, message: "An account with this email already exists" });
  }
  next(error);
 }
};
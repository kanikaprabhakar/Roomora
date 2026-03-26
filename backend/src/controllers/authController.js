import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function buildToken(userId) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }

  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}

function sanitizeUser(userDoc) {
  return {
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    matchProfile: userDoc.matchProfile || null
  };
}

export async function signup(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const normalizedRole = (role || "student").toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    if (!["owner", "student"].includes(normalizedRole)) {
      return res.status(400).json({ message: "Role must be either owner or student." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole
    });

    const token = buildToken(user._id);

    return res.status(201).json({
      message: "Signup successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = buildToken(user._id);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

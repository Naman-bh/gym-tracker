const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { authMiddleware, JWT_SECRET } = require("../middleware/authMiddleware");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sanitizeUser(userDoc) {
  return {
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    heightCm: userDoc.heightCm,
    weightKg: userDoc.weightKg,
    age: userDoc.age,
    gender: userDoc.gender,
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (!["member", "trainer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(name).trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const storedPassword = String(user.password || "");
    let valid = false;

    if (storedPassword.startsWith("$2")) {
      valid = await bcrypt.compare(password, storedPassword);
    } else {
      // Support legacy plain-text passwords and upgrade on successful login.
      valid = password === storedPassword;
      if (valid) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role heightCm weightKg age gender");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Could not fetch profile" });
  }
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, heightCm, weightKg, age, gender } = req.body;
    const payload = {};

    if (name) payload.name = name;
    if (email) payload.email = email.toLowerCase();
    if (heightCm !== undefined) payload.heightCm = heightCm;
    if (weightKg !== undefined) payload.weightKg = weightKg;
    if (age !== undefined) payload.age = age;
    if (gender) payload.gender = gender;

    const existing = payload.email
      ? await User.findOne({ email: payload.email, _id: { $ne: req.user.id } })
      : null;

    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, payload, {
      new: true,
      runValidators: true,
    }).select("name email role heightCm weightKg age gender");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Could not update profile" });
  }
});

module.exports = router;

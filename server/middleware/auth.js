const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

/**
 * PROTECT MIDDLEWARE
 * - verifies token
 * - finds user
 * - attaches user to req
 */
const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("🔑 TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🧾 DECODED TOKEN:", decoded);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    // 3. Find user in DB
    // 3. Find user in DB
    const user = await User.findById(decoded.id).select("-password");

    console.log("👤 USER FROM DB:", user);
    console.log("Searching user with ID:", decoded.id);

    // 👇 BUS YEH CHHOTA SA DEBUG CODE YAHAN ADD KARO 👇
    if (!user) {
      const allUsers = await User.find({}).limit(2).select("_id email");
      console.log("🔍 DATABASE ME MAUJOOD USERS:", allUsers);
    }
    // 👆 ------------------------------------------ 👆

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 4. attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("❌ AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Token failed or expired",
    });
  }
};

/**
 * ADMIN MIDDLEWARE
 * - checks role
 */
const admin = (req, res, next) => {
  try {
    console.log("🔐 ROLE CHECK:", req.user?.role);

    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        message: "Admin access required",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Role check failed",
    });
  }
};

module.exports = { protect, admin };
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const dotenv = require('dotenv')

dotenv.config()

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer ")) {
      try {
        token = req.headers.authorization.split(" ")[1];
        console.log("Received Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // Token is valid, proceed to the next middleware
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
          return res.status(401).json({ message: "User not found" });
        }

        next(); // Token is valid, move to next middleware
      } catch (error) {
        // Handle expired token error
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: "Not authorized, invalid token" });
      }
    } else {
      return res.status(401).json({ message: "Not authorized, invalid token format" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

  
  module.exports = { protect };
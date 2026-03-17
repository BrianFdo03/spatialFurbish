const jwt = require("jsonwebtoken");
const User = require("../models/User");

// for customers no need to give allowedRoles parameter.
// for admin and staff need to give parameter like ['admin', 'staff']
const protectRoute = (allowedRoles = [], requireVerified) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Login to access page" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid token" });
      }

      // by select -password we get everything except the password
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ message: "Unauthorized - User not found" });
      }

      const { role, verified, id } = decoded;

      // Role-based access control
      if (allowedRoles.length > 0) {
        // role check for admin and staff
        if (!allowedRoles.includes(role)) {
          return res.status(403).json({
            message: "Access Denied - Insufficient access permission",
          });
        }
      }

      // block unverified users
      if (requireVerified && !verified) {
        return res
          .status(403)
          .json({ message: "Access Denied: Account not verified" });
      }

      req.user = user; // Attach user info to request object to work with next function
      // req.userRole = decoded.role;
      // req.userVerified = decoded.verified;

      next();
    } catch (error) {
      console.log("Error in ProtectRoute middleware: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protectRoute, checkAuth };

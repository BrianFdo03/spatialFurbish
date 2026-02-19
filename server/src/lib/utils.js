const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user, res) => {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload = {
    id: user._id,
    role: user.role,
    verified: user.verified,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false, // use secure cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};

module.exports = { generateToken };

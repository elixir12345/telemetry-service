const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // console.log(user);

    // Check if the session ID is still active
    const session = user.activeSessions.find(
      (session) => session.session === decoded.session
    );
    if (!session) {
      return res.status(401).json({ message: "Session expired2" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }

  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ message: "Invalid or expired token" });
  //   }
  //   req.user = user;
  //   next();
  // });
};

module.exports = authenticateToken;

import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({
        success: false,
        message: "No token provided"
      });
    }

    // ✅ Handle both: "Bearer token" AND "token"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure id exists
    if (!decoded.id) {
      return res.json({
        success: false,
        message: "Invalid token payload"
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
    return res.json({
      success: false,
      message: "Unauthorized Access"
    });
  }
};

export default auth;
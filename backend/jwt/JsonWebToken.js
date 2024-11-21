import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const SECRET_KEY = process.env.JWT_SECRET; // Replace with your actual secret key
// Function to generate a JWT token
function generateToken(userId) {
  const payload = { id: userId }; // Payload contains the user ID
  const options = { expiresIn: "1h" }; // Token expiration time

  return jwt.sign(payload, SECRET_KEY, options);
}

function verifyToken(token) {
  const jwt_status = jwt.verify(token, SECRET_KEY);
  return jwt_status;
}

const authenticateUser = (req, res, next) => {
  try {
    // Get the token from the cookie
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach the decoded payload to the request object
    next(); // Proceed to the next middleware or route
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export { generateToken, verifyToken, authenticateUser };

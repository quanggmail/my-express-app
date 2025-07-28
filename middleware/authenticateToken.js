// This is a conceptual example for educational purposes only.
// Do not use in production without thorough security review and understanding.

const jwt = require('jsonwebtoken'); // You would need to install 'jsonwebtoken'
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;; // **IMPORTANT: Use a strong, environment-variable-based secret in production**

const authenticateToken = (req, res, next) => {
    // Get the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        return res.sendStatus(401); // If no token, unauthorized
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // If token is not valid (e.g., expired, wrong secret), forbidden
        }
        req.user = user; // Attach the decoded user payload to the request
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authenticateToken;
const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("No or invalid authorization header.");
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.log("Token verification failed:", err);
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = {
    authMiddleware
};

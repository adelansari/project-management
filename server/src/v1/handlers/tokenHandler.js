const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

// Function to decode JWT token from request headers
const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")[1];
        try {
            // Verify JWT token using secret key and return decoded data
            const tokenDecoded = jsonwebtoken.verify(bearer, process.env.TOKEN_SECRET_KEY);
            return tokenDecoded;
        } catch {
            // If token is invalid or expired, return false
            return false;
        }
    } else {
        // If authorization header is not present, return false
        return false;
    }
};

// Middleware function to verify JWT token and authenticate user
exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        // Find user by ID extracted from JWT token
        const user = await User.findById(tokenDecoded.id);
        if (!user) return res.status(401).json("Unauthorized");
        // Add authenticated user object to request object
        req.user = user;
        next();
    } else {
        res.status(401).json("Unauthorized");
    }
};

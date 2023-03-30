const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

// Helper function to decode the token from the request headers
const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ")[1];
        try {
            // Verify and decode the token
            const tokenDecoded = jsonwebtoken.verify(bearer, process.env.TOKEN_SECRET_KEY);
            return tokenDecoded;
        } catch {
            return false;
        }
    } else {
        return false;
    }
};

// Middleware function to verify the token and add the user to the request object
exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        // Find the user in the database by their ID
        const user = await User.findById(tokenDecoded.id);
        if (!user) return res.status(401).json("Unathorized");

        // Add the user to the request object
        req.user = user;
        next();
    } else {
        res.status(401).json("Unathorized");
    }
};

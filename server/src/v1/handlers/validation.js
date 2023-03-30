const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Middleware function to validate the request body using express-validator
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return any validation errors
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Helper function to check if a value is a valid MongoDB ObjectId
exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

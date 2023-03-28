const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

// Middleware function to validate request data using express-validator
exports.validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // If validation errors are present, return 400 Bad Request with error messages
    return res.status(400).json({ errors: errors.array() })
  }
  // If validation is successful, move to next middleware
  next()
}

// Function to check if a value is a valid MongoDB ObjectID
exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

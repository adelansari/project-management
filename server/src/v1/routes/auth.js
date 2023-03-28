const router = require("express").Router();
const userController = require("../controllers/user");
const { body } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const User = require("../models/user");

// Route for user registration
router.post(
    "/signup",
    body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
    body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
    body("confirmPassword").isLength({ min: 8 }).withMessage("confirmPassword must be at least 8 characters"),
    body("username").custom((value) => {
        // Check if the username is already taken
        return User.findOne({ username: value }).then((user) => {
            if (user) {
                return Promise.reject("username already used");
            }
        });
    }),
    validation.validate, // Validate request
    userController.register // Register user
);

// Route for user login
router.post(
    "/login",
    body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
    body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
    validation.validate, // Validate request
    userController.login // Login user
);

// Route for verifying user token
router.post(
    "/verify-token",
    tokenHandler.verifyToken, // Verify token
    (req, res) => {
        res.status(200).json({ user: req.user });
    }
);

module.exports = router;

const router = require("express").Router();
const userController = require("../controllers/user");
const { body } = require("express-validator");
const validation = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const User = require("../models/user");

// Route for signing up a new user
router.post(
    "/signup",
    // Validate the request body using express-validator
    body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
    body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
    body("confirmPassword").isLength({ min: 8 }).withMessage("confirmPassword must be at least 8 characters"),
    // Check if the provided username is already in use
    body("username").custom((value) => {
        return User.findOne({ username: value }).then((user) => {
            if (user) {
                return Promise.reject("username already used");
            }
        });
    }),
    validation.validate,
    userController.register
);

// Route for logging in an existing user
router.post(
    "/login",
    // Validate the request body using express-validator
    body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
    body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
    validation.validate,
    userController.login
);

// Route for verifying a JSON Web Token
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;

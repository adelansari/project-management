const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

/**
 * Controller function for registering a new user.
 * Encrypts the user's password using CryptoJS and creates a new user in the database using the User model.
 * Generates a JWT token for the user and returns it along with the newly created user in a JSON response.
 */
exports.register = async (req, res) => {
    const { password } = req.body; // Destructure the password field from the request body

    try {
        // Encrypt the password using CryptoJS
        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY);

        // Create a new user in the database using the User model and the encrypted password
        const user = await User.create({ ...req.body, password: encryptedPassword });

        // Generate a JWT token for the user
        const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "24h" });

        // Return the newly created user and JWT token to the client in a JSON response
        res.status(200).json({ user, token });
    } catch (err) {
        // If an error occurs, return a 500 error response with the error message
        res.status(500).json(err);
    }
};

/**
 * Controller function for logging in a user.
 * Retrieves the user from the database based on the username.
 * Decrypts the user's password using CryptoJS and compares it with the password provided in the request body.
 * Generates a JWT token for the user and returns it along with the user (with password field removed) in a JSON response.
 */
exports.login = async (req, res) => {
    const { username, password } = req.body; // Destructure the username and password fields from the request body

    try {
        // Retrieve the user from the database based on the username
        const user = await User.findOne({ username }).select("password username");

        // If the user is not found, return a 401 error response with an error message
        if (!user) {
            return res.status(401).json({
                errors: [
                    {
                        param: "username",
                        msg: "Invalid username or password",
                    },
                ],
            });
        }

        // Decrypt the user's password using CryptoJS
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);

        // Compare the decrypted password with the password provided in the request body
        if (decryptedPassword !== password) {
            // If the passwords do not match, return a 401 error response with an error message
            return res.status(401).json({
                errors: [
                    {
                        param: "username",
                        msg: "Invalid username or password",
                    },
                ],
            });
        }

        // Remove the password field from the user object before returning it in the response
        user.password = undefined;

        // Generate a JWT token for the user
        const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "24h" });

        // Return the user object and JWT token to the client in a JSON response
        res.status(200).json({ user, token });
    } catch (err) {
        // If an error occurs, return a 500 error response with the error message
        res.status(500).json(err);
    }
};

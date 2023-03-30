const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
    const { password } = req.body;
    try {
        // Encrypt the user's password before storing it in the database
        req.body.password = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();

        // Create a new user in the database
        const user = await User.create(req.body);

        // Generate a JSON Web Token for the user
        const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "24h" });

        // Return the newly created user and their token
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user in the database by their username
        const user = await User.findOne({ username }).select("password username");
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

        // Decrypt the user's password from the database
        const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);

        // Check if the provided password matches the decrypted password
        if (decryptedPass !== password) {
            return res.status(401).json({
                errors: [
                    {
                        param: "username",
                        msg: "Invalid username or password",
                    },
                ],
            });
        }

        // Remove the password from the user object before returning it
        user.password = undefined;

        // Generate a JSON Web Token for the user
        const token = jsonwebtoken.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "24h" });

        // Return the logged-in user and their token
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json(err);
    }
};

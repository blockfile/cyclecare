const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cycleCare = require("../server/model/model");
const app = express();

app.use(cors());
app.use(express.json());
const bcrypt = require("bcryptjs");

mongoose
    .connect(process.env.DATABASE_ACCESS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the username already exists
        const userExists = await cycleCare.findOne({ username: username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if the email already exists
        const emailExists = await cycleCare.findOne({ email: email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // If neither exist, proceed to create the new user
        const newUser = await cycleCare.create({ username, email, password });
        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "An error occurred during registration",
            error: error.message,
        });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check both username or email for login credentials
        const user = await cycleCare.findOne({
            $or: [{ username }, { email: username }],
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid username or email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Login successful
        res.json({
            message: "Login successful",
            user: { id: user._id, username: user.username },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

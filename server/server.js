const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cycleCare = require("../server/model/model");
const app = express();
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());
const bcrypt = require("bcryptjs");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });
console.log("JWT Secret:", process.env.JWT_SECRET);
app.use(cors());
mongoose
    .connect(process.env.DATABASE_ACCESS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) return res.sendStatus(401); // No token, return 401 Unauthorized
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token, return 403 Forbidden
        req.user = user;
        next();
    });
}

app.post("/user/last-menstrual", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.body;
    const { userId } = req.user;
    try {
        const updatedUser = await cycleCare.findByIdAndUpdate(
            userId,
            { startDate, endDate }, // Make sure these match the field names in your schema
            { new: true }
        );
        res.json({
            message: "Menstrual dates updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update menstrual dates error:", error);
        res.status(500).json({
            message: "Failed to update menstrual dates",
            error: error.message,
        });
    }
});
app.post("/periods/start", authenticateToken, async (req, res) => {
    const { start } = req.body;
    const userId = req.user.userId; // Assuming your auth system sets `req.user`

    try {
        const updatedUser = await cycleCare.findByIdAndUpdate(
            userId,
            { $push: { periods: { start: new Date(start), end: null } } },
            { new: true }
        );
        res.status(200).json({
            message: "Period started successfully",
            periods: updatedUser.periods,
        });
    } catch (error) {
        console.error("Error starting period:", error);
        res.status(500).json({
            message: "Failed to start period",
            error: error.message,
        });
    }
});
app.post("/periods/end", authenticateToken, async (req, res) => {
    const { end } = req.body;
    const userId = req.user.userId;

    try {
        // Fetch the user first to get the latest period that hasn't ended
        const user = await cycleCare.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const periods = user.periods;
        const lastPeriod = periods.find((p) => !p.end);
        if (lastPeriod) {
            lastPeriod.end = new Date(end);
            await user.save();
            res.status(200).json({
                message: "Period ended successfully",
                periods: user.periods,
            });
        } else {
            res.status(400).json({ message: "No open period to end" });
        }
    } catch (error) {
        console.error("Error ending period:", error);
        res.status(500).json({
            message: "Failed to end period",
            error: error.message,
        });
    }
});
app.delete("/periods/delete", authenticateToken, async (req, res) => {
    const { date } = req.body;
    const userId = req.user.userId;

    try {
        const user = await cycleCare.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out the period that matches the date
        const newPeriods = user.periods.filter((period) => {
            return !(
                new Date(period.start).getTime() <= new Date(date).getTime() &&
                new Date(date).getTime() <= new Date(period.end).getTime()
            );
        });

        user.periods = newPeriods;
        await user.save();

        res.status(200).json({
            message: "Period deleted successfully",
            periods: user.periods,
        });
    } catch (error) {
        console.error("Error deleting period:", error);
        res.status(500).json({
            message: "Failed to delete period",
            error: error.message,
        });
    }
});

app.post("/user/cycle", authenticateToken, async (req, res) => {
    const { cycle } = req.body;
    const { userId } = req.user;

    try {
        const updatedUser = await cycleCare.findByIdAndUpdate(
            userId,
            { cycle },
            { new: true }
        );
        res.json({ message: "Cycle updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update cycle error:", error);
        res.status(500).json({
            message: "Failed to update cycle",
            error: error.message,
        });
    }
});

app.put("/user/update", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { username, email } = req.body;
    try {
        const updatedUser = await cycleCare.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({
            message: "Failed to update user",
            error: error.toString(),
        });
    }
});

app.get("/user/info", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await cycleCare.findById(userId).select("-password"); // Ensure this includes the cycle length
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            message: "Error fetching user data",
            error: error.message,
        });
    }
});

app.post(
    "/user/upload-avatar",
    authenticateToken,
    upload.single("avatar"),
    async (req, res) => {
        const { userId } = req.user; // Now req.user should be defined if the token is valid

        const avatarData = req.file.buffer.toString("base64");
        try {
            const user = await cycleCare.findByIdAndUpdate(
                userId,
                { avatar: avatarData },
                { new: true }
            );
            res.json({
                message: "Avatar updated successfully",
                avatar: user.avatar,
            });
        } catch (error) {
            res.status(500).send({
                message: "Failed to update avatar",
                error: error.message,
            });
        }
    }
);
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*#?&]{7,15}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be 8-16 characters long, start with an uppercase letter, and contain no spaces.",
        });
    }
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
        const user = await cycleCare
            .findOne({
                $or: [{ username }, { email: username }],
            })
            .select("+password"); // Ensure password is selected for verification

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid username or email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send the necessary fields to decide the redirection in the frontend
        res.json({
            message: "Login successful",
            token,
            cycle: user.cycle,
            startDate: user.startDate,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
// Backend: Start Period Route
app.post("/periods/start", authenticateToken, async (req, res) => {
    const { start } = req.body;
    const userId = req.user.userId;

    try {
        // Push a new period with only a start date
        const updatedUser = await cycleCare.findByIdAndUpdate(
            userId,
            { $push: { periods: { start: new Date(start), end: null } } }, // Push a new period with only a start date
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

app.get("/user/mood-data", authenticateToken, async (req, res) => {
    const { userId } = req.user; // Get userId from the authenticated token
    try {
        // Fetch the user by ID and retrieve the moodTracker field
        const user = await cycleCare.findById(userId).select("moodTracker");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back the user's mood data
        res.json({ moodTracker: user.moodTracker });
    } catch (error) {
        console.error("Error fetching mood data:", error);
        res.status(500).json({
            message: "Failed to fetch mood data",
            error: error.message,
        });
    }
});

app.post("/user/save-mood", authenticateToken, async (req, res) => {
    const { date, mood } = req.body;
    const userId = req.user.userId;

    try {
        const user = await cycleCare.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Convert the incoming date to just the date portion (ignore time)
        const formattedDate = new Date(date).toDateString();

        // Check if there's already a mood entry for this date
        const existingMood = user.moodTracker.find(
            (entry) => new Date(entry.date).toDateString() === formattedDate
        );

        if (existingMood) {
            // Update the existing mood
            existingMood.mood = mood;
        } else {
            // Add a new mood entry for this date
            user.moodTracker.push({ date, mood });
        }

        await user.save();

        res.status(200).json({ message: "Mood saved successfully" });
    } catch (error) {
        console.error("Error saving mood:", error);
        res.status(500).json({ message: "Failed to save mood" });
    }
});

// Backend: End Period Route
app.post("/periods/end", authenticateToken, async (req, res) => {
    const { end } = req.body;
    const userId = req.user.userId;

    try {
        // Find the most recent period that doesn't have an end date
        const user = await cycleCare.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const lastPeriod = user.periods.find((p) => !p.end);
        if (lastPeriod) {
            lastPeriod.end = new Date(end); // Set the end date for the last period
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
    const { cycle, irregular } = req.body; // Expect cycle and irregular fields
    const { userId } = req.user; // Assuming userId is set in the token

    // Log the incoming data for debugging

    try {
        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }

        // Fetch the user and log it
        const user = await cycleCare.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Log the user before update
        console.log("User before update:", user);

        // Update the cycle and irregular fields
        user.cycle = cycle;
        user.irregular = irregular;
        await user.save();

        // Log after the save
        console.log("User after update:", user);

        res.json({ message: "Cycle updated successfully", user });
    } catch (error) {
        console.error("Error updating cycle data:", error.message);
        res.status(500).json({
            message: "Failed to update cycle",
            error: error.message,
        });
    }
});

app.put("/user/update", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { username, email, age, contact, irregular, lastPeriod } = req.body;

    try {
        const updatedUser = await cycleCare.findByIdAndUpdate(
            userId,
            { username, email, age, contact, irregular, lastPeriod },
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
app.get("/periods", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await cycleCare.findById(userId).select("periods");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter periods to only return those that have ended in the past
        const currentDate = new Date();
        const pastPeriods = user.periods.filter((period) => {
            return !period.end || new Date(period.end) <= currentDate;
        });

        res.json({ periods: pastPeriods });
    } catch (error) {
        console.error("Error fetching periods:", error);
        res.status(500).json({
            message: "Failed to fetch periods",
            error: error.message,
        });
    }
});
app.get("/user/cycle-data", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming the token includes userId
        const user = await cycleCare
            .findById(userId)
            .select("periods startDate endDate");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send the cycle data as a response
        res.json({
            start: user.startDate, // Assuming these fields exist in your schema
            end: user.endDate,
            periods: user.periods, // Assuming 'periods' is the array with past periods
        });
    } catch (error) {
        console.error("Error fetching cycle data:", error);
        res.status(500).json({
            message: "Failed to fetch cycle data",
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

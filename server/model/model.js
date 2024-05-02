const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");
const cycleCareSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        cycle: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        periods: [
            {
                start: Date,
                end: Date,
            },
        ],
    },
    { timestamps: true }
);

cycleCareSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const cyclecare = mongoose.model("cyclecare", cycleCareSchema);

module.exports = cyclecare;

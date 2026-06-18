const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    test_name: String,
    rating: String,
    feedback: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Submit Feedback
app.post("/submit-feedback", async (req, res) => {
     console.log("Received data:", req.body);
    try {
        const { name, email, test_name, rating, feedback } = req.body;

        const newFeedback = new Feedback({
            name,
            email,
            test_name,
            rating,
            feedback
        });

        await newFeedback.save();

        res.send("Feedback submitted successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error saving feedback");
    }
});

// Get All Feedback
app.get("/feedbacks", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Rating Statistics
app.get("/rating-stats", async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: "$rating",
                    total: { $sum: 1 }
                }
            }
        ]);

        const formatted = stats.map(item => ({
            rating: item._id,
            total: item.total
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Test Statistics
app.get("/test-stats", async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: "$test_name",
                    total: { $sum: 1 }
                }
            }
        ]);

        const formatted = stats.map(item => ({
            test_name: item._id,
            total: item.total
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json(error);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

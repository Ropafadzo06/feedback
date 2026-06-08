const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ropah2106!", 
    database: "feedback_system"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        return;
    }
    console.log("Connected to MySQL");
});

app.post("/submit-feedback", (req, res) => {

    const { name, email, test_name, rating, feedback } = req.body;

    const sql =
    "INSERT INTO feedback (name, email, test_name, rating, feedback) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [name, email, test_name, rating, feedback],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send("Error saving feedback");
                return;
            }

            res.send("Feedback submitted successfully!");
        }
    );
});
app.get("/rating-stats", (req, res) => {

    const sql = `
        SELECT rating, COUNT(*) AS total
        FROM feedback
        GROUP BY rating
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

app.get("/test-stats", (req, res) => {

    const sql = `
        SELECT test_name, COUNT(*) AS total
        FROM feedback
        GROUP BY test_name
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
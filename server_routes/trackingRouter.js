import express from "express";
import { pool } from "./config/dbConfig.js"; // Ensure that dbConfig.js is also using ES module syntax
import validator from "validator"; // Import the validator library

const router = express.Router();

// Utility function for sanitizing inputs
const sanitizeInput = (input) => {
  return validator.escape(input); // Escapes HTML characters
};

// Basic validation function for emoji_unicode
const validateEmojiUnicode = (emoji_unicode) => {
  // Check if emoji_unicode is not empty and contains only valid characters
  if (!emoji_unicode || typeof emoji_unicode !== 'string' || !/^[\w\s\p{L}]+$/u.test(emoji_unicode)) {
    throw new Error("Invalid emoji_unicode format");
  }
};

router.get("/totals", async (req, res) => {
  try {
    // Fetch all records from the totals table
    const getSettings = await pool.query("SELECT * FROM totals");

    // Send the results as JSON
    res.json(getSettings.rows);
  } catch (err) {
    console.error("Error fetching totals:", err.message);
    res.status(500).json({ error: "Server Error: Could not get totals!" });
  }
});

router.post("/update-view-count", async (req, res) => {
  try {
    let { emoji_unicode } = req.body;

    if (!emoji_unicode) {
      return res.status(400).json({ error: "emoji_unicode is required" });
    }

    emoji_unicode = sanitizeInput(emoji_unicode);
    validateEmojiUnicode(emoji_unicode);

    const result = await pool.query(
      `INSERT INTO totals (emoji_unicode, total_views, total_likes)
       VALUES ($1, 1, 0)
       ON CONFLICT (emoji_unicode)
       DO UPDATE SET total_views = totals.total_views + 1
       RETURNING *`,
      [emoji_unicode]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update View Count Error:", err.message);
    console.error(err.stack); // Log the stack trace
    res
      .status(500)
      .json({ error: "Server Error: Could not update view count!", details: err.message });
  }
});

router.post("/update-like-count", async (req, res) => {
  try {
    let { emoji_unicode } = req.body;

    if (!emoji_unicode) {
      return res.status(400).json({ error: "emoji_unicode is required" });
    }

    emoji_unicode = sanitizeInput(emoji_unicode);
    validateEmojiUnicode(emoji_unicode);

    const result = await pool.query(
      `INSERT INTO totals (emoji_unicode, total_views, total_likes)
       VALUES ($1, 0, 1)
       ON CONFLICT (emoji_unicode)
       DO UPDATE SET total_likes = totals.total_likes + 1
       RETURNING *`,
      [emoji_unicode]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Update Like Count Error:", err.message);
    console.error(err.stack); // Log the stack trace
    res
      .status(500)
      .json({ error: "Server Error: Could not update like count!", details: err.message });
  }
});


export default router;

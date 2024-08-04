import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequestHandler } from "@remix-run/express";
import * as build from "./build/server/index.js";

// Determine the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Express app
const app = express();

// Serve static files from 'build/client'
app.use(express.static(join(__dirname, "build/client")));

// Handle all routes using the Remix request handler
app.all("*", createRequestHandler({ build }));

// Error handling middleware
app.use((err, res) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

// Use environment variable for port or default to 3200
const port = process.env.PORT || 3200;

// Start the server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});

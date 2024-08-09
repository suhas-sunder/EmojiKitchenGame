import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequestHandler } from "@remix-run/express";
import * as build from "./build/server/index.js"; // Import the build object
import cors from "cors";
import dotenv from "dotenv";
import trackingRouter from "./server_routes/trackingRouter.js";

dotenv.config({ path: "./.env" });

const apiVersion = "v1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3200;

// CORS - Allow all origins
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'build/client'
app.use(express.static(join(__dirname, "build/client")));

// Routes
app.use(`/${apiVersion}/api/tracking`, trackingRouter);

// Handle all other routes using the Remix request handler
app.all("*", createRequestHandler({ build })); // Use the build object

// Error handling middleware to be triggered if all of the above routes fail
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});

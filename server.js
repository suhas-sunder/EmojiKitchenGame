import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequestHandler } from "@remix-run/express";
import * as build from "./build/server/index.js"; // Import the build object
import cors from "cors";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import dotenv from "dotenv";
import trackingRouter from "./server_routes/trackingRouter.js";

dotenv.config({ path: "./.env" });

const apiVersion = "v1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3200;

// Set security HTTP headers with updated CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // Allows scripts from the same origin
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com", // Google Fonts
        ],
        imgSrc: [
          "'self'",  // Allow images from the same origin
          "data:",    // Allow data URIs for images
          "https://fonts.gstatic.com", // Google Fonts images
          "https://www.gstatic.com",  // Google static images
          "https://www.honeycombartist.com" // R2 bucket images
        ],
        connectSrc: [
          "'self'", 
          "https://www.honeycombartist.com" // Allow connections to R2 bucket
        ],
        fontSrc: [
          "'self'", 
          "https://fonts.gstatic.com" // Allow Google Fonts
        ],
        frameSrc: ["'self'"], // Allow frames from the same origin
        objectSrc: ["'self'"], // Allow objects from the same origin
        mediaSrc: ["'self'"],  // Allow media from the same origin
        childSrc: ["'self'"],  // Allow child frames from the same origin
        manifestSrc: ["'self'"], // Allow web app manifests
        workerSrc: ["'self'"],  // Allow workers from the same origin
        scriptSrcElem: ["'self'"], // Allow script elements from the same origin
        styleSrcElem: ["'self'"], // Allow style elements from the same origin
        upgradeInsecureRequests: [], // Allow mixed content
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://emojikitchengame.com",
      "https://www.emojikitchengame.com",
      "emojikitchengame.com",
      "www.emojikitchengame.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization against XSS
app.use(xss());

// Removes duplicate fields from HTTP parameters to prevent HTTP parameter pollution
app.use(hpp());

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

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
import crypto from "crypto"; // For generating nonces

dotenv.config({ path: "./.env" });

const apiVersion = "v1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3200;

// Middleware to generate nonce for each request
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Set security HTTP headers with a more relaxed CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://static.cloudflareinsights.com",
          "https://cdn.jsdelivr.net",
          "'unsafe-inline'", // Temporarily allow inline scripts
        ],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "'unsafe-inline'", // Temporarily allow inline styles
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://www.gstatic.com",
          "https://www.honeycombartist.com",
        ],
        connectSrc: [
          "'self'",
          "https://www.honeycombartist.com",
          "https://static.cloudflareinsights.com",
          "https://cdn.jsdelivr.net",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
        ],
        frameSrc: ["'self'"],
        objectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        childSrc: ["'self'"],
        manifestSrc: ["'self'"],
        workerSrc: ["'self'"],
        scriptSrcElem: [
          "'self'",
          "https://static.cloudflareinsights.com",
          "https://cdn.jsdelivr.net",
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'", // Temporarily allow inline styles
        ],
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

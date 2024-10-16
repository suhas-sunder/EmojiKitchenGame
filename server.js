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
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

// Set security HTTP headers with relaxed CSP, allowing everything from specified domains
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "*"], // Allow everything from specified domains
        scriptSrc: [
          "'self'",
          "*", // Allow all scripts from specified domains
          "'unsafe-inline'", // Allow inline scripts (for testing)
          "'unsafe-eval'", // Allow eval() (for testing)
        ],
        styleSrc: [
          "'self'",
          "*", // Allow all styles from specified domains
          "'unsafe-inline'", // Allow inline styles
        ],
        imgSrc: [
          "'self'",
          "*", // Allow all images from specified domains
          "data:", // Allow data URIs for images
        ],
        connectSrc: [
          "'self'",
          "*", // Allow all connections from specified domains
        ],
        fontSrc: [
          "'self'",
          "*", // Allow all fonts from specified domains
        ],
        frameSrc: ["'self'"],
        objectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        childSrc: ["'self'"],
        manifestSrc: ["'self'"],
        workerSrc: ["'self'"],
        scriptSrcElem: [
          "'self'",
          "*", // Allow all scripts from specified domains
          "'unsafe-inline'", // Allow inline scripts in script elements
          "'unsafe-eval'", // Allow eval() (for testing)
        ],
        styleSrcElem: [
          "'self'",
          "*", // Allow all styles from specified domains
          "'unsafe-inline'", // Allow inline styles in style elements
        ],
        upgradeInsecureRequests: [], // Allow mixed content
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Middleware for CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://emojikitchengame.com",
      "https://www.emojikitchengame.com",
      "emojikitchengame.com",
      "www.emojikitchengame.com",
      "https://us.i.posthog.com",
      "https://static.cloudflareinsights.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["*"], // Allow all headers
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

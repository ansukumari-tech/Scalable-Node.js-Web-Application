require("dotenv").config();

const path = require("node:path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const createApp = () => {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || false }));
  app.use(express.json({ limit: "10kb" }));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(morgan(isProduction ? "combined" : "dev"));

  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.use(
    "/api/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 20,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many authentication requests. Please try again later.",
      },
    }),
    authRoutes
  );

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  app.use(errorHandler);
  return app;
};

module.exports = createApp;

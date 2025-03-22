import configLoader from "../utils/configLoader.js";
import rateLimit from "express-rate-limit";
import { URL } from "url";
import path from "path";
import cors from "cors";

/**
 * Setup middleware for the express application.
 * 
 * @param {Object} express - The express instance.
 * @param {string} __dirname - The directory name.
 * @param {string} __web - The web directory.
 * @returns {Object} - The configured middlewares.
 */
function setup(express, __dirname, __web) {

  const assets = express.static(path.join(__dirname, __web, "/assets"));
  const { server } = configLoader();

  // skipcq: JS-D1001
  const handler = (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests",
    });
  };

  const limiter_min = rateLimit({
    windowMs: 60000,
    limit: 60,
    handler,
  });

  const limiter_sec = rateLimit({
    windowMs: 1000,
    limit: 10,
    handler,
  });

  // skipcq: JS-D1001
  const not_found = (req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({
        status: 404,
        message: "Not found",
      });
    } else {
      res
        .status(404)
        .sendFile(path.join(__dirname, __web, "/pages/404.html"));
    }
  };

  const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  };

  const url = new URL(`http://${server.host}:${server.port}`);

  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : [url.origin],
    methods: ['GET'],
    credentials: true,
    optionsSuccessStatus: 204
  };

  const corsConfig = cors(corsOptions);

  return { assets, limiter_min, limiter_sec, not_found, corsConfig, securityHeaders }
}

export default { setup }
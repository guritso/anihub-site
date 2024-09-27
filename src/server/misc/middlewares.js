import rateLimit from "express-rate-limit";
import path from "path";

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

  return { assets, limiter_min, limiter_sec, not_found}
}

export default { setup }
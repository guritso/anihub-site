const fs = require("fs");
const path = require("path");

const cache = new Set();
const PATH = path.join(__dirname, "../config/config.json");

module.exports = () => {
  try {
    const config = JSON.parse(fs.readFileSync(PATH));

    cache.add(JSON.stringify(config));

    return config;
  } catch (error) {
    console.error("Error:", error.message, "- using cached config.json!");

    const arr = cache.values().toArray();

    return JSON.parse(arr.toReversed()[0]);
  }
};

'use strict';

const fs = require("fs");
const path = require("path");

const cache = new Set();
const PATH = path.join(__dirname, "../config/config.json");

module.exports = () => {
  try {
    const config = JSON.parse(fs.readFileSync(PATH, 'utf8'));

    cache.add(JSON.stringify(config));

    return config;
  } catch (error) {
    console.error("Error:", error.message, "- using cached config.json!");

    const arr = Array.from(cache);

    if (arr.length > 0) {
      return JSON.parse(arr[arr.length - 1]);
    } else {
      throw new Error("No cached config.json available.");
    }
  }
};

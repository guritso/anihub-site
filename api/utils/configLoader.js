'use strict';

const fs = require('fs');
const path = require('path');

const cache = new Set();

function configLoader() {
  try {
    const configPath = path.join(__dirname, '../config/config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    cache.add(JSON.stringify(config));
    return config;
  } catch (error) {
    console.error("Error:", error.message, "- using cached config.json!");
    const arr = Array.from(cache);
    if (arr.length > 0) {
      return JSON.parse(arr[0]);
    } else {
      throw new Error('No cached config.json available.');
    }
  }
}

module.exports = configLoader;
module.exports.cache = cache;

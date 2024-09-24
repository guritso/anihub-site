import defaultConfig from "../misc/default.js";
import path from "path";
import fs from "fs";

/**
 * Function to deeply merge two objects.
 * @param {object} target - The target object.
 * @param {object} source - The source object.
 * @returns {object} - Object merged.
 */
function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
}

const cache = new Set();
/**
 * Loads the config from `src/config/config.json` and caches it.
 * If the file does not exist or is not valid JSON, it will use the cached config if available.
 * @param {object} options - The options to load the config with.
 * @param {boolean} options.warn - Whether to warn if the config is not found.
 * @returns {object} The config object.
 */
function configLoader({ warn = true } = {}) {
  try {
    const configPath = path.join("src/config/config.json");
    const fileConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

    const mergedConfig = deepMerge(defaultConfig, fileConfig);

    cache.add(JSON.stringify(mergedConfig));

    return mergedConfig;
  } catch (error) {
    if (warn) {
      console.error(`Error: ${error.message} - using cached config.json!`);
    }
    const arr = Array.from(cache);

    if (arr.length > 0) {
      return JSON.parse(arr.pop());
    } else {
      if (warn) {
        console.error(
          "No cached config found, using default config. Please create a config.json file."
        );
      }
      return defaultConfig;
    }
  }
}

export default configLoader;

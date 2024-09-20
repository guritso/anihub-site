import configLoader from "./configLoader.js";
import path from "path";
import fs from "fs";

const configPath = path.join(process.cwd(), "src/config/config.json");

const configChanger = {
  /**
   * Changes the value of a key in the config.json file.
   * 
   * @param {string[]} keys - The keys to the value to change.
   * @param {*} value - The new value.
   */
  change: (keys, value) => {
    const config = configLoader({ warn: false });

    let current = config;
    let strConfig = JSON.stringify(config);

    for (const key of keys) {
      current = current[key];
    }

    strConfig = JSON.parse(strConfig.replace(JSON.stringify(current), JSON.stringify(value)));

    fs.writeFileSync(configPath, JSON.stringify(strConfig, null, 2));
  }
};

export default configChanger;
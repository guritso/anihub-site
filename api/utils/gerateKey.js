const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


module.exports = {
  write: (config) => {
    const key = crypto.randomBytes(32).toString("hex");
    const envPath = path.join(__dirname, "../../.env");
    
    if (!fs.existsSync(envPath)) {
      process.stdout.write("↺ gerating key...\r");
      fs.writeFileSync(envPath, `API_KEY=${key}`);
      process.env.API_KEY = key;
    } else if (config?.override) {
      process.stdout.write("↺ updating key...\r");
      const envContent = fs.readFileSync(envPath, "utf8");
      fs.writeFileSync(envPath, envContent.replace(/API_KEY=.*/, `API_KEY=${key}`));
      process.env.API_KEY = key;
    }

    if (config?.show) {
      process.stdout.write(` ↺ loading key...\r`);
      console.log(`\n  • key: ${process.env.API_KEY}`);
    }
  }
}
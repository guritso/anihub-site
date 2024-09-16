import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const generateKey = {
  write: (config) => {
    const key = crypto.randomBytes(32).toString('hex');
    const envPath = path.join('.env');

    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, `API_KEY=${key}`);
      process.env.API_KEY = key;
    } else if (config?.override || !process.env.API_KEY) {
      let envContent = fs.readFileSync(envPath, 'utf8');

      if (!envContent.includes('API_KEY')) {
        envContent += '\nAPI_KEY=';
      }

      fs.writeFileSync(envPath, envContent.replace(/API_KEY=.*/, `API_KEY=${key}`));
      process.env.API_KEY = key;
    }

    if (config?.show) {
      process.stdout.write(' ↺ loading key...\r');
      console.log(`\n  • key: ${process.env.API_KEY}`);
    }
  }
};

export default generateKey;
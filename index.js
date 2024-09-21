import "dotenv/config";

import path from "path";
import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import AniHub from "./src/server/AniHub.js";
import routeMapper from "./src/server/utils/mapper.js";
import generateKey from "./src/server/utils/generateKey.js";
import configLoader from "./src/server/utils/configLoader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Client class extends AniHub to initialize and configure the application.
 */
class Client extends AniHub {
  constructor() {
    const { name, version } = JSON.parse(readFileSync("./package.json"));

    super({ name, version });
    this.middles = {};
    this.app.client = this;
    this.__dirname = __dirname;
    this.config = configLoader;

    this.middles.assets = express.static(
      path.join(this.__dirname, "/src/assets")
    );
    this.middles.limiter = rateLimit({
      windowMs: 1000,
      max: 10,
      handler: (req, res) => {
        res.status(429).json({
          status: 429,
          message: "Too many requests",
        });
      },
    });
  }

  start() {
    const { port, security } = this.config();

    super.start(process.env.PORT || port);

    generateKey.write({
      override: security.newKeyOnStart,
      show: security.showKeyOnStart,
    });
  }
}

const routes = await routeMapper(path.join(__dirname, "/src/server/routes"));
const client = new Client();

client.start();
client.routes(routes);

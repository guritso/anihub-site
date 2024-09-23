"use strict";

import "dotenv/config";

import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import AniHub from "./src/server/AniHub.js";
import routeMapper from "./src/server/utils/mapper.js";
import generateKey from "./src/server/utils/generateKey.js";
import config from "./src/server/utils/configLoader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Client class extends AniHub to initialize and configure the application.
 */
class Client extends AniHub {
  constructor() {
    super();
    this.middles = {};
    this.app.client = this;
    this.__dirname = __dirname;
    this.config = config;

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

    this.middles.notFound = (req, res) => {
      if (req.path.startsWith("/api/")) {
        res.status(404).json({
          status: 404,
          message: "Not found",
        });
      } else {
        res.status(404).sendFile(path.join(this.__dirname, "/src/pages/404.html"));
      }
    };
  }

  start() {
    const { server, security } = this.config();

    const port = process.env.PORT || server.port;
    const host = process.env.HOST || server.host;

    super.start(host, port);

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

"use strict";

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import terminal from "@guritso/terminal";
import AniHub from "./src/server/AniHub.js";
import routeMapper from "./src/server/utils/mapper.js";
import generateKey from "./src/server/utils/generateKey.js";
import config from "./src/server/utils/configLoader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __server = "src/server";
const __web = "src/web";

/**
 * Client class extends AniHub to initialize and configure the application.
 */
class Client extends AniHub {
  constructor() {
    super();
    this.app.client = this;
    this.__dirname = __dirname;
    this.__server = __server;
    this.__web = __web;

    this.config = () => {
      const cg = config();
      terminal.setVerbose(cg.server.verbose);
      return cg;
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

const routes = await routeMapper(path.join(__dirname, __server, "/routes"));
const client = new Client();

client.start();
client.routes(routes);

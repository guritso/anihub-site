"use strict";

import cors from "cors";
import path from "path";
import express from "express";
import { readFileSync } from "fs";
import terminal from "@guritso/terminal";
import animeSync from "./services/animeSync.js";
import middlewares from "./misc/middlewares.js";

/**
 * AniHub class to manage the server and routes.
 * @class
 */
export default class AniHub {
  constructor(data) {
    terminal.setup();

    this.express = express;
    this.app = express();
    this.data = data;
    this.cache = new Map();

    this.app.use(cors());
    this.app.use(express.json());
    this.app.set("trust proxy", 1);
    this.app.set("x-powered-by", false);

  }

  /**
   * Starts the server on the specified host and port.
   * @param {string} host - The host to start the server on.
   * @param {number} port - The port to start the server on.
   */
  start(host, port) {
    terminal.start(host, port);

    this.app.listen(port, host, () => {
      terminal.pass("server %H32 online");
      animeSync.start(this.cache);
    });
  }

  /**
   * Loads the routes and middlewares into the application.
   * @param {Array} routes - The routes to load.
   */
  routes(routes) {
    const middles = middlewares.setup(this.express, this.__dirname, this.__web);

    this.app.use("/assets", middles.assets);
    this.app.use("/api", middles.limiter_min, middles.limiter_sec);
    this.app.use("/profile", middles.limiter_min, middles.limiter_sec);

    this.app.get("/", (_req, res) => {
      let indexHtml = readFileSync(
        path.join(this.__dirname, this.__web, "/pages/index.html"),
        "utf8"
      );

      for (const route of routes) {
        if (!route.data.method) {
          const name = route.data.path.split("/").slice(-2).join("");
          try {
            const render = route.render(this.config(), this.cache, this.__web);
            indexHtml = indexHtml.replace(`{{${name}}}`, render);
          } catch (error) {
            terminal.log(`${name}: ${error.message}`);
          }
        }
      }

      res.send(indexHtml);
    });

    for (const route of routes) {
      try {
        this.app[route.data.method](route.data.path, route.handler);
        terminal.log(`${route.data.method} ${route.data.path}`);
      } catch (error) {
        if (route.render) continue;
        error.message = `${route.data.path} - ${error.message}`;
        terminal.log(error);
      }
    }

    this.app.get("/api", (req, res) => {
      res.send({
        status: res.statusCode,
        data: { ...this.data, uptime: process.uptime() },
      });
    });

    this.app.use(middles.not_found);
  }
}

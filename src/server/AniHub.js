import cors from "cors";
import path from "path";
import express from "express";
import { readFileSync } from "fs";
import terminal from "./misc/terminal.js";
import animeSync from "./services/animeSync.js";

/**
 * AniHub class to manage the server and routes.
 * @class
 */
export default class AniHub {
  constructor(data) {
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
   * Starts the server on the specified port.
   * @param {number} port - The port to start the server on.
   */
  start(port) {
    terminal.head(port, this.data);

    this.app.listen(port, () => {
      terminal.online(this.app);
      animeSync.start(this.cache);
    });
  }

  /**
   * Loads the routes into the application.
   * @param {Array} routes - The routes to load.
   */
  routes(routes) {
    this.app.use("/assets", this.middles.assets);
    this.app.use("/api", this.middles.limiter);
    this.app.get("/", (req, res) => {
      let indexHtml = readFileSync(
        path.join(this.__dirname, "/src/pages/index.html"),
        "utf8"
      );

      for (const route of routes) {
        if (!route.data.method) {
          const name = route.data.path.split("/").slice(-2).join("");
          try {
            const render = route.render(this.config(), this.cache);
            indexHtml = indexHtml.replace(`{{${name}}}`, render);
          } catch (error) {
            terminal.log(`${name}:`, error.message);
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

    this.app.use((req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      return res.sendFile(path.join(this.__dirname, "/src/pages/404.html"));
    });

    this.app.use((req, res, next) => {
      res.status(404).send({ status: res.statusCode, message: "Not found" });
      next();
    });
  }
}

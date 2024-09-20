import "dotenv/config";

import { print, setVerbose } from "./src/server/utils/logger.js";
import configLoader from "./src/server/utils/configLoader.js";
import animeSync from "./src/server/services/animeSync.js";
import generateKey from "./src/server/utils/generateKey.js";
import routeMapper from "./src/server/utils/mapper.js";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from 'url';
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", 1);
app.use("/assets", express.static(path.join(__dirname, "/src/assets")));
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests",
    });
  },
});

app.use("/api", limiter);

app.locals.cache = new Map();

const routes = await routeMapper(
  path.join(__dirname, "/src/server/routes")
);

app.get("/", (req, res) => {
  let indexHtml = fs.readFileSync(
    path.join(__dirname, "/src/pages/index.html"),
    "utf8"
  );

  for (const route of routes) {
    if (!route.data.method) {
      const name = route.data.path.split("/").slice(-2).join("");
      try {
        const render = route.render(configLoader(), app.locals.cache);
        indexHtml = indexHtml.replace(`{{${name}}}`, render);
      } catch (error) {
        console.error(`${name}:`, error.message);
      }
    }
  }

  res.send(indexHtml);
});

print("%Y↺% loading routes...");

for (const route of routes) {
  try {
    app[route.data.method](route.data.path, route.handler);
    print(`  %G✓% ${route.data.method} ${route.data.path}`);
  } catch (error) {
    if (route.render) continue;
    print(`  %R✗% ${route.data.path}`);
    print(error);
  }
}

app.get("/api", (req, res) => {
  res.send({ status: res.statusCode, message: "API is running" });
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  return res.sendFile(path.join(__dirname, "/src/pages/404.html"));
});

app.use((req, res, next) => {
  res.status(404).send({ status: res.statusCode, message: "Not found" });
  next();
});

generateKey.write({
  override: configLoader().security.newKeyOnStart,
  show: configLoader().security.showKeyOnStart,
});

print("%Y↺% loading server...");
app.listen(configLoader().port, () => {
  print(`  %G✓% online on %Chttp://localhost:${configLoader().port}%`);
  setVerbose(configLoader().animeSync.verbose);
  animeSync.start(app.locals.cache);
});

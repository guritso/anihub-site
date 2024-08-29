const animeSync = require("./api/services/animeSync");
const config = require("./api/utils/configLoader");
const routeMapper = require("./api/utils/mapper");
const gerateKey = require("./api/utils/gerateKey");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.json());
app.use(cors());

app.locals.cache = new Map();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

(async () => {
  const routes = await routeMapper(path.join(__dirname, "/api/routes"));
  console.log(`↺ loading routes...`);

  routes.forEach((route) => {
    app[route.data.method](route.data.path, route.handler);
    console.log(`  • ${route.data.method} ${route.data.path}`);
  });
  
  app.get("/api/*", (req, res) => {
    res.status(404).send({ status: res.statusCode, message: "Not found" });
  });
  
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "/assets/pages/404.html"));
  });

  gerateKey.write({
    override: config().security.newKeyOnStart,
    show: config().security.showKeyOnStart
  });

  console.log("↺ loading server...");
  app.listen(config().port, () => {
    console.log("  • online on port ", config().port);
    console.log("↺ loading anime sync...");
    animeSync.start(app.locals.cache)
  });
})();

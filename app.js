const animeSync = require("./api/services/animeSync");
const config = require("./api/utils/configLoader");
const routeMapper = require("./api/utils/mapper");
const gerateKey = require("./api/utils/generateKey");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();

require("dotenv").config();

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.json());
app.use(cors());

app.locals.cache = new Map();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const routes = routeMapper(path.join(__dirname, "/api/routes"));
console.log(`↺ loading routes...`);

routes.forEach((route) => {
    app[route.data.method](route.data.path, route.handler);
    console.log(`  • ${route.data.method} ${route.data.path}`);
});

app.get("/api", (req, res) => {
    res.send({ status: res.statusCode, message: `API is running` });
});

app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(__dirname, "/assets/pages/404.html"));
});

app.use((req, res, next) => {
    res.status(404).send({ status: res.statusCode, message: "Not found" });
    next();
});

gerateKey.write({
    override: config().security.newKeyOnStart,
    show: config().security.showKeyOnStart
});

console.log("↺ loading server...");
app.listen(config().port, () => {
    console.log("  • online on port ", config().port);
    console.log("↺ loading anime sync...");
    animeSync.start(app.locals.cache);
});

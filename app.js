import configLoader from './api/utils/configLoader.js';
import animeSync from './api/services/animeSync.js';
import generateKey from './api/utils/generateKey.js';
import routeMapper from './api/utils/mapper.js';
import rateLimit from 'express-rate-limit';
import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

const app = express();

app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Too many requests'
    });
  }
});

app.use('/api', limiter);

app.locals.cache = new Map();

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

const routes = await routeMapper(path.join(process.cwd(), '/api/routes'), '/api');
console.log('↺ loading routes...');

for (const route of routes) { 
  app[route.data.method](route.data.path, route.handler);
  console.log(`  • ${route.data.method} ${route.data.path}`);
}

app.get('/redirect', (req, res) => {
  res.redirect(req.query.url);
});

app.get('/api', (req, res) => {
  res.send({ status: res.statusCode, message: 'API is running' });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(process.cwd(), '/assets/pages/404.html'));
});

app.use((req, res, next) => {
  res.status(404).send({ status: res.statusCode, message: 'Not found' });
  next();
});

generateKey.write({
  override: configLoader().security.newKeyOnStart,
  show: configLoader().security.showKeyOnStart
});

console.log('↺ loading server...');
app.listen(configLoader().port, () => {
  console.log('  • online on port ', configLoader().port);
  console.log('↺ loading anime sync...');
  animeSync.start(app.locals.cache);
});

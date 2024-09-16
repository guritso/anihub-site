import configLoader from './src/backend/utils/configLoader.js';
import animeSync from './src/backend/services/animeSync.js';
import generateKey from './src/backend/utils/generateKey.js';
import routeMapper from './src/backend/utils/mapper.js';
import rateLimit from 'express-rate-limit';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const app = express();

app.use('/assets', express.static(path.join(process.cwd(), '/src/assets')));
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

const routes = await routeMapper(path.join(process.cwd(), '/src/backend/routes'));

app.get('/', (req, res) => {
  let indexHtml = fs.readFileSync(path.join(process.cwd(), '/src/pages/index.html'), 'utf8');

  for (const route of routes) {
    if (!route.data.method) {
      const name = route.data.path.split('/').pop();
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

console.log('↺ loading routes...');

for (const route of routes) { 
  if (!route.data.method) continue;
  app[route.data.method](route.data.path, route.handler);
  console.log(`  • ${route.data.method} ${route.data.path}`);
}

app.get('/api', (req, res) => {
  res.send({ status: res.statusCode, message: 'API is running' });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(process.cwd(), '/src/pages/404.html'));
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
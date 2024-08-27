const { getAnimesCache, startSyncing } = require('./animeUpdates');

const express = require('express');
const config = require('./config');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
app.use('/assets', express.static(path.join(__dirname, '../assets')));

const animeAccount = config.user.accounts.find(a => a.type === "myanimelist");

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api/userupdates', async (req, res) => {
  const { username, airing, completed, watching } = req.query;
  let animeUpdates = await getAnimesCache(username || animeAccount.username);

  if (!animeUpdates?.length) {
    return res.send({ status: res.statusCode, data: [] });
  }

  if (airing == "true") {
    animeUpdates = animeUpdates.filter(anime => anime.airing);
  }

  if (completed == "true") {
    animeUpdates = animeUpdates.filter(anime => anime.user.completed);
  }

  if (watching == "true") {
    animeUpdates = animeUpdates.filter(anime => !anime.user.completed);
  }

  res.send({ status: res.statusCode, data: animeUpdates });

});

app.get('/api/user', (req, res) => {
  res.json(config.user);
});

app.listen(config.port, () => {
  console.log(`Server is running http://localhost:${config.port}`);
  startSyncing(animeAccount.username)
});

const configLoader = require('../utils/configLoader');
const jikan = require('../utils/jikanApi');
const imaget = require('../utils/imaget');
const path = require('path');
const fs = require('fs');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processAnime = async (anime) => {
  const animeInfo = await jikan.getAnime(anime.entry.mal_id).then(res => res.data);
  if (!animeInfo) return null;
  
  const date = new Date(anime.date);
  const imageUrl = animeInfo.images.webp.image_url;
  const imagePath = await imaget.save(imageUrl, anime.entry.mal_id);

  return {
    id: anime.entry.mal_id,
    title: animeInfo.title,
    image: imagePath,
    episodes: animeInfo.episodes,
    airing: animeInfo.airing,
    link: anime.entry.url,
    user: {
      completed: animeInfo.episodes === anime.increment,
      increment: anime.increment,
      date: date,
    }
  };
};

module.exports = {
  start: async (cache) => {
    while (true) {
      const { user, animeSync } = configLoader();
      const { username } = user.accounts.myanimelist;

      if (!animeSync.enabled) {
        process.stdout.write("anime sync is disabled!\r");
        await wait(animeSync.syncInterval);
        continue;
      }

      try {
        const history = await jikan.getHistory(username).then(res => {
          const uniqueItems = [];
          for (const anime of res.data) {
            if (!uniqueItems.some(a => a.entry.mal_id === anime.entry.mal_id)) {
              uniqueItems.push(anime);
            }
          }
          return uniqueItems;
        });

        const totalAnimes = history?.length || 0;
        if (totalAnimes === 0) {
          process.stdout.write(`${username} has no recent history!\r`);
          await wait(animeSync.syncInterval);
          continue;
        }

        const animes = [];
        for (const anime of history) {
          const processedAnime = await processAnime(anime);
          if (processedAnime) {
            animes.push(processedAnime);
          }
          await wait(animeSync.animeInterval);

          const progress = ((animes.length) / totalAnimes) * 100;
          process.stdout.write(`fetching ${username}: ${progress.toFixed(2)}%\r`);
        }
        await cache.set(username, animes);

        if (animeSync.verbose) {
          console.table([{
            user: username,
            fetched: animes.length,
            errors: totalAnimes - animes.length,
          }]);
        }

        await wait(animeSync.syncInterval);
      } catch (error) {
        console.error(`Error: ${error.message} `);
        await wait(animeSync.syncInterval);
      }
    }
  },
}

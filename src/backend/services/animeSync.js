import configLoader from '../utils/configLoader.js';
import imaget from '../utils/imaget.js';
import mal from '../utils/mal.js';

const CONCURRENCY_LIMIT = 20;

async function fetchAnimeList(username, order, status) {
  const animes = [];
  const animelist = await mal.getAnimeList({ username, order, status });

  const queue = [...animelist];
  const workers = Array(CONCURRENCY_LIMIT).fill(null).map(() => processQueue(queue, animes, animelist.length));

  await Promise.all(workers);

  return animes;
}

async function processQueue(queue, animes, total) {
  while (queue.length > 0) {
    const anime = queue.shift();
    try {
      const img = await imaget.save({ url: anime.image, id: anime.id, location: 'src/assets/img/covers' });
      animes.push({ ...anime, image: img.path.replace('src', '') });
      const progress = ((animes.length) / total) * 100;

      process.stdout.write(`\x1b[2Ksaving covers ${animes.length}/${total} ${progress.toFixed(2)}%\r`);
    } catch (error) {
      console.error(`anime ${anime.id}: ${error.message}`);
    }
  }
}

export default class animeSync {
  static start = async (cache) => {
    while (true) {
      const { user, animeSync } = configLoader();
      const { username } = user.accounts.myanimelist;

      if (!animeSync.enabled) return process.stdout.write('\x1b[2K  • animeSync disabled\n');

      try {
        const animes = await fetchAnimeList(username, "last_updated", 7);
        cache.set(username.toLowerCase(), animes);
        process.stdout.write('\x1b[2K  • all done')
      } catch (error) {
        console.error(error.message);
      }
      await new Promise(resolve => setTimeout(resolve, animeSync.syncInterval));
    }
  }
};

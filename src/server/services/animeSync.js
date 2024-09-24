import configLoader from "../utils/configLoader.js";
import terminal from "@guritso/terminal";
import imaget from "../utils/imaget.js";
import mal from "../utils/mal.js";

const CONCURRENCY_LIMIT = 20;

/**
 * Fetches anime list from MyAnimeList.net
 * @param {string} username The MyAnimeList username
 * @param {string} order The order to sort the list by, e.g. "last_updated"
 * @param {number} status The status of the anime to fetch, e.g. 7 for all
 * @returns {Promise<Anime[]>} A list of anime objects
 */
async function fetchAnimeList(username, order, status) {
  const animes = [];
  const animelist = await mal.getAnimeList({ username, order, status });

  const queue = [...animelist];
  const workers = Array(CONCURRENCY_LIMIT)
    .fill(null)
    .map(() => processQueue(queue, animes, animelist.length));

  await Promise.all(workers);

  return animes;
}

/**
 * Processes a queue of anime objects and saves their cover images to the
 * disk. It also updates the anime object with the new image path.
 * @param {Anime[]} queue The queue of anime objects to process
 * @param {Anime[]} animes The array to store the processed anime objects in
 * @param {number} total The total number of anime objects to process
 */
async function processQueue(queue, animes, total) {
  while (queue.length > 0) {
    const anime = queue.shift();
    try {
      const img = await imaget.save({
        url: anime.image,
        id: anime.id,
        location: "src/web/assets/img/covers",
      });
      animes.push({ ...anime, image: img.path.replace("src/web/", "") });
      const progress = (animes.length / total) * 100;

      if (img.new) {
        terminal.log(
          `saving covers ${animes.length}/${total} ${progress.toFixed(2)}%`
        );
      }
    } catch (error) {
      terminal.log(`anime ${anime.id}: ${error.message}`);
    }
  }
}

// skipcq: JS-D1001
export default class animeSync {
  static wait = async (interval) => {
    await new Promise((resolve) => setTimeout(resolve, interval));
  };

  static start = async (cache) => {
    terminal.log("loading anime sync...");
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const config = configLoader();
      const { username } = config.user.accounts.myanimelist;
      const sync = config.animeSync;

      if (!sync.enabled) {
        terminal.log("animeSync %H31 disabled");
        await animeSync.wait(60000);
        continue;
      }

      if (sync.syncInterval < 60000) {
        terminal.log(
          new Error("Anime sync interval must be greater than 60000ms")
        );
        await animeSync.wait(60000);
        continue;
      }

      try {
        const animes = await fetchAnimeList(username, "last_updated", 7);
        cache.set(username.toLowerCase(), animes);
        terminal.log("done");
      } catch (error) {
        terminal.log(error);
      }
      await animeSync.wait(sync.syncInterval);
    }
  };
}

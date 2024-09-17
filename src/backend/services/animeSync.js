import { print, setVerbose } from "../utils/logger.js";
import configLoader from "../utils/configLoader.js";
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
        location: "src/assets/img/covers",
      });
      animes.push({ ...anime, image: img.path.replace("src", "") });
      const progress = (animes.length / total) * 100;

      if (img.new) {
        print(
          `%SA  %Y•% saving covers ${animes.length}/${total} ${progress.toFixed(
            2
          )}%`
        );
      }
    } catch (error) {
      print(`  %R✗% anime ${anime.id}: ${error.message}`);
    }
  }
}

export default class animeSync {
  static start = async (cache) => {
    print("%Y↺% loading anime sync...");
    while (true) {
      const { user, animeSync } = configLoader();
      const { username } = user.accounts.myanimelist;

      setVerbose(animeSync.verbose);
      if (!animeSync.enabled) {
        print("%SA  %R✗% animeSync %Rdisabled%");
        await new Promise((resolve) =>
          setTimeout(resolve, animeSync.syncInterval)
        );
        continue;
      }

      try {
        const animes = await fetchAnimeList(username, "last_updated", 7);
        cache.set(username.toLowerCase(), animes);
        print("%SA  %G✓% done");
      } catch (error) {
        print(error);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, animeSync.syncInterval)
      );
    }
  };
}

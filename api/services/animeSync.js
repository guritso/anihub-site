const configLoader = require("../utils/configLoader");
const imaget = require("../utils/imaget");

const status = {
  1: "Watching",
  2: "Completed",
  3: "On-Hold",
  4: "Dropped",
  6: "Plan to Watch"
};

const sort = {
  "name": 1,
  "completed_at": 2,
  "score": 4,
  "last_updated": 5,
  "status": 7,
  "progress": 12
};

async function getAnimeList(username, order = 5) {
  const PAGE_SIZE = 299;
  const animes = [];

  for (let page = 1; page > -1; page++) {
    const data = await fetch(`https://myanimelist.net/animelist/${username}/load.json?order=${order}&offset=${animes.length}&status=7`).then(res => res.json());
    for (const [index, anime] of data.entries()) {
      const image = await imaget.save(changeUrl(anime.anime_image_path), anime.anime_id, "assets/img/covers");
      animes.push({
        id: anime.anime_id,
        title: anime.anime_title,
        image: image || changeUrl(anime.anime_image_path),
        episodes: anime.anime_num_episodes,
        airing: anime.anime_airing_status === 1,
        link: `https://myanimelist.net/${anime.anime_url}`,
        user: {
          status: status[anime.status],
          increment: anime.num_watched_episodes,
          date: new Date(anime.updated_at * 1000),
        }
      });
      const progress = ((index + 1) / data.length) * 100;
      process.stdout.write(`fetching ${username} page ${page}: ${progress.toFixed(2)}%\r`);
    }
    if (data.length < PAGE_SIZE) {
      break;
    }
  }
  return animes;
}

function changeUrl(url) {
  const newUrl = url.replace('/r/192x272', '').split('?')[0];
  return newUrl.replace('.jpg', '.webp');
}

module.exports = {
  start: async (cache) => {
    while (true) {
      const { user, animeSync } = configLoader();
      const { username } = user.accounts.myanimelist;
      try {
        const animes = (await getAnimeList(username, sort.last_updated)).filter(anime => animeSync.filters.status.includes(anime.user.status));
        cache.set(username.toLowerCase(), animes);
      } catch (error) {
        console.error(error.message);
      }
      await new Promise(resolve => setTimeout(resolve, animeSync.syncInterval));
    }
  }
}

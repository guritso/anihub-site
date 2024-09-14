"use strict";

const SORT = {
  name: 1,
  completed_at: 2,
  score: 4,
  last_updated: 5,
  status: 7,
  progress: 12,
};

const STATUS = {
  1: "watching",
  2: "completed",
  3: "on hold",
  4: "dropped",
  6: "plan to watch",
};

export default class mal {
  static formatUrl(url) {
    return url.replace("/r/192x272", "").split("?")[0].replace(".jpg", ".webp");
  }

  static getAnimeList = async ({
    username,
    order = "last_updated",
    status = 7,
  }) => {
    const URL = `https://myanimelist.net/`;
    const QUERY = `animelist/${username}/load.json?order=${SORT[order]}&status=${status}`;
    const PAGE_SIZE = 299;
    const ANIMES = [];

    while (true) {
      const data = await fetch(URL + QUERY + `&offset=${ANIMES.length}`).then(
        (res) => res.json()
      );
      for (const anime of data) {
        ANIMES.push({
          id: anime.anime_id,
          title: anime.anime_title,
          image: mal.formatUrl(anime.anime_image_path),
          episodes: anime.anime_num_episodes,
          airing: anime.anime_airing_status === 1,
          link: `${URL}${anime.anime_url}`,
          user: {
            status: STATUS[anime.status],
            increment: anime.num_watched_episodes,
            date: new Date(anime.updated_at * 1000),
          },
        });

        process.stdout.write(`\x1b[2Kfetching ${username} page: ${Math.floor(ANIMES.length / PAGE_SIZE)}\r`);
      }

      if (data.length < PAGE_SIZE) {
        break;
      }
    }
    return ANIMES;
  };
}

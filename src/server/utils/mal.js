"use strict";

import terminal from "@guritso/terminal";

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
  /**
   * Formats a MyAnimeList image URL to the correct size and format.
   *
   * @param {string} url The URL to format.
   * @returns {string} The formatted URL.
   */
  static formatUrl(url) {
    return url.replace("/r/192x272", "").split("?")[0].replace(".jpg", ".webp");
  }

  /**
   * Fetches the anime list for a given username from MyAnimeList.
   *
   * @param {object} options - The options to fetch the anime list with.
   * @param {string} options.username - The username to fetch the anime list for.
   * @param {string} options.order - The order to sort the anime list by.
   * @param {number} options.status - The status to filter the anime list by.
   * @returns {Promise<Array>} A promise that resolves to an array of anime objects.
   */
  static getAnimeList = async ({
    username,
    order = "last_updated",
    status = 7,
  }) => {
    const URL = "https://myanimelist.net/";
    const QUERY = `animelist/${username}/load.json?order=${SORT[order]}&status=${status}`;
    const PAGE_SIZE = 299;
    const ANIMES = [];
    let PAGE = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      PAGE++;

      if (!username) {
        return [];
      }

      const data = await fetch(`${URL}${QUERY}&offset=${ANIMES.length}`).then(
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
            score: anime.score,
            date: new Date(anime.updated_at * 1000),
          },
        });
      }
      terminal.log(`fetching ${username} page: ${PAGE}`);

      if (data.length < PAGE_SIZE) {
        hasMoreData = false;
      }
    }
    return ANIMES;
  };
}

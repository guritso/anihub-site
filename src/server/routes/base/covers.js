import path from "path";

/**
 * @class Covers
 * @description Handles anime cover picture requests.
 */
export default class Covers {
  static data = {
    method: "get",
    base: true,
    params: "anime/:id",
  };

  static handler = (req, res, next) => {
    const id = req.params.id.split(".")[0];
    const { cache, config, __web, __dirname } = req.app.client;
    const { username } = config().user.accounts.myanimelist;

    const animes = cache.get(`animes:${username.toLowerCase()}`) || [];
    const anime = animes.find((a) => a.id === Number(id));

    if (!anime) {
      next();
      return;
    }

    res.sendFile(path.join(__dirname, anime.path));
  };
}

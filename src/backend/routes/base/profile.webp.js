import configLoader from "../../utils/configLoader.js";
import imaget from "../../utils/imaget.js";
import path from "path";

export default class ProfileWebp {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    const cache = req.app.locals.cache;
    const cacheKey = 'profile.webp';
    const cacheData = cache.get(cacheKey);

    if (cacheData) {
      res.set('Content-Type', `image/${cacheData.type}`);
      res.end(Buffer.from(cacheData.file));
    }

    const { user } = configLoader();

    imaget.save({
      url: user.avatarUrl,
      id: user.avatarUrl.split("/").pop(),
      location: path.join(process.cwd(), "src/assets/img/profile"),
      type: user.avatarUrl.split("?")[0].split(".").pop()
    }).then((image) => {
      cache.set(cacheKey, image);

      if (!res.headersSent) {
        const imageType = cache.get(cacheKey).type;
        res.set('Content-Type', `image/${imageType}`);
        return res.end(Buffer.from(cache.get(cacheKey).file));
      }
    }).catch((err) => {
      process.stdout.write(`\x1b[31m${err}\x1b[0m\n`);
      if (!res.headersSent) {
        return res.sendFile(path.join(process.cwd(), "src/assets/img/favicon.ico"));
      }
    });
  }
}
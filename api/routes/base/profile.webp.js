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
      res.sendFile(path.join(process.cwd(), cacheData));
    }

    imaget.save(configLoader().user.avatarUrl, "profile", "assets/img/", true).then((image) => {
      cache.set(cacheKey, image);

      if (!res.headersSent) {
        return res.sendFile(path.join(process.cwd(), image));
      }
    }).catch((err) => {
      process.stdout.write(`\x1b[31m${err}\x1b[0m\n`);
      if (!res.headersSent) {
        return res.sendFile(path.join(process.cwd(), "assets/img/favicon.ico"))
      }
    });
  }
}
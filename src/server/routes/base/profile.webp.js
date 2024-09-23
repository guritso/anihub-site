import terminal from "@guritso/terminal";
import configLoader from "../../utils/configLoader.js";
import imaget from "../../utils/imaget.js";
import crypto from 'crypto';
import path from "path";

// skipcq: JS-D1001
export default class ProfileWebp {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    const cache = req.app.client.cache;
    const cacheKey = 'profile.webp';
    const cacheData = cache.get(cacheKey);

    if (cacheData) {
      res.set('Content-Type', `image/${cacheData.type}`);
      res.end(Buffer.from(cacheData.file));
    }

    const { user } = configLoader();

    const hash = crypto.createHash('sha256').update(user.avatarUrl).digest('hex');
    const fileExtension = user.avatarUrl.split("?")[0].split(".").pop();

    imaget.save({
      url: user.avatarUrl,
      id: hash,
      location: path.join(process.cwd(), "src/assets/img/profile"),
      type: fileExtension
    }).then((image) => {
      cache.set(cacheKey, image);

      if (!res.headersSent) {
        const imageType = cache.get(cacheKey).type;
        res.set('Content-Type', `image/${imageType}`);
        res.end(Buffer.from(cache.get(cacheKey).file));
      }
    }).catch((err) => {
      terminal.log(err);

      if (!res.headersSent) {
        res.sendFile(path.join(process.cwd(), "src/assets/img/favicon.ico"));
      }
    });
  }
}

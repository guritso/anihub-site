import path from "path";
import crypto from "crypto";
import imaget from "../../utils/imaget.js";
import { readdirSync } from "fs";
/**
 * @class Profile
 * @description Handles profile picture requests.
 */
export default class Profile {
  static data = {
    method: "get",
    base: true,
    params: "picture/:id",
  };

  static handler = async (req, res) => {
    const id = req.params.id;
    const { cache, config, __web, __dirname } = req.app.client;
    const avatar_url = config().user.avatarUrl;
    const hash = crypto.createHash("sha256").update(avatar_url).digest("hex");
    const fileExtension = path.extname(avatar_url.split("?")[0]).slice(1);

    const saveImage = async () => {
      return imaget
        .save({
          url: avatar_url,
          id: hash,
          location: path.join(__dirname, `${__web}/assets/img/profile`),
          type: fileExtension,
          overwrite: true,
        })
        .then((image) => {
          if (image) {
            cache.set(`picture:${config().user.name}`, image);
          }

          return image;
        });
    };

    if (id === "undefined") {
      const image = await saveImage();

      if (!image) {
        res.redirect("/favicon.ico");
        return;
      }

      res.sendFile(
        path.join(__dirname, `${__web}/assets/img/profile`, image.id)
      );
    } else {
      saveImage();

      const isPresent = readdirSync(
        path.join(__dirname, `${__web}/assets/img/profile`)
      ).includes(id);

      if (isPresent) {
        res.sendFile(path.join(__dirname, `${__web}/assets/img/profile`, id));
      } else {
        res.redirect("/favicon.ico");
      }
    }
  };
}

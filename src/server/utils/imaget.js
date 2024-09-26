import fs from "fs";

const types = ["png", "webp", "jpg", "jpeg", "gif", "svg", "ico"];

const imaget = {
  /**
   * Save an image to the specified location
   * @param {object} options - The options to save the image with.
   * @param {string} options.url - The URL to download the image from.
   * @param {string} options.id - The ID of the image.
   * @param {string} options.location - The location to save the image to.
   * @param {string} options.type - The format of the image.
   * @param {boolean} options.overwrite - Whether to overwrite the image if it already exists.
   * @returns {object} object containing the image buffer and path
   */
  save: async ({ url, id, location, type, overwrite = false }) => {
    if (!types.includes(type)) {
      type = "webp";
    }

    const imageId = `${id}.${type}`.replaceAll("/", "-");

    const image = {
      id: imageId,
      path: `${location}/${imageId}`,
      file: null,
      type,
      new: false,
    };

    if (!fs.existsSync(location)) {
      fs.mkdirSync(location, { recursive: true });
    }

    if (fs.existsSync(image.path) && !overwrite) {
      image.new = false;
      image.file = fs.readFileSync(image.path);

      return image;
    }

    const buffer = await fetch(url)
      .then((res) => {
        if (!res.ok || !res.body) return null;
        if (res.headers.get("content-type") === "text/html") return null;

        return res.arrayBuffer();
      })
      .catch(() => null);

    if (buffer === null) {
      console.error(
        new Error(`Failed to download image: ${url}, is the url valid?`)
      );

      return false;
    }

    fs.writeFileSync(image.path, Buffer.from(buffer));

    image.new = true;
    image.file = buffer;

    return image;
  },
};

export default imaget;

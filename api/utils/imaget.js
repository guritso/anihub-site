import fs from 'fs';
import path from 'path';

const imaget = {
  /**
   * Save an image to the specified location
   * @param {string} url - The URL of the image to save
   * @param {string} id - The name of the image
   * @param {string} location - The location to save the image
   * @returns {string} The path to the saved image
   */
  save: async (url, id, location, overwrite = false) => {
    const imagePath = path.join(location, `${id}.webp`);

    if (!fs.existsSync(location)) {
      fs.mkdirSync(location, { recursive: true });
    }

    if (fs.existsSync(imagePath) && !overwrite) {
      return imagePath;
    }

    const buffer = await fetch(url).then((res) => res.ok ? res.arrayBuffer() : null);

    if (buffer === null) {
      throw new Error(`Failed to download image: ${url}, is the url valid?`);
    }

    fs.writeFileSync(imagePath, Buffer.from(buffer));
    return imagePath;
  },
};

export default imaget;
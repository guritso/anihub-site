import fs from 'fs';
import path from 'path';

const types = ['png', 'webp', 'jpg', 'jpeg', 'gif', 'svg', 'ico'];

const imaget = {
  /**
   * Save an image to the specified location
   * @param {string} url - The URL of the image to save
   * @param {string} id - The name of the image
   * @param {string} location - The location to save the image
   * @returns {object} object containing the image buffer and path
   */
  save: async ({ url, id, location, type, overwrite = false }) => {
    if (!types.includes(type)) {
      type = 'webp';
    }

    const imagePath = path.join(location, `${id}.${type}`.replaceAll('/', '-'));

    if (!fs.existsSync(location)) {
      fs.mkdirSync(location, { recursive: true });
    }

    if (fs.existsSync(imagePath) && !overwrite) {
      return { path: imagePath, file: fs.readFileSync(imagePath), type: type, new: false };
    }

    const buffer = await fetch(url).then((res) => res.ok ? res.arrayBuffer() : null);

    if (buffer === null) {
      throw new Error(`Failed to download image: ${url}, is the url valid?`);
    }

    fs.writeFileSync(imagePath, Buffer.from(buffer));
    return { path: imagePath, file: buffer, type: type, new: true };
  },
};

export default imaget;
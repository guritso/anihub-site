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
  save: async (url, id, location) => {
    const imagePath = path.join(location, `${id}.webp`);

    if (!fs.existsSync(location)) {
      fs.mkdirSync(location, { recursive: true });
    }

    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
    process.stdout.write(`saving ${id}.webp\r`);
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    fs.writeFileSync(imagePath, Buffer.from(buffer));
    return imagePath;
  },
};

export default imaget;
'use strict';

const fs = require('fs')
const path = require('path')

module.exports = {
  save: async (url, id, location) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const coversPath = path.join("assets/img/covers");
    const imagePath = location ? path.join(location, `${id}.webp`) : path.join(coversPath, `${id}.webp`);

    if (!fs.existsSync(coversPath)) {
      fs.mkdirSync(coversPath, { recursive: true });
    }
    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    return imagePath;
  },
};
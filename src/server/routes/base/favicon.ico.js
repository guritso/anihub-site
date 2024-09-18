import path from "path";

// skipcq: JS-D1001
export default class FaviconIco {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    res.sendFile(path.join(process.cwd(), "src/assets/img/favicon.ico"));
  }
}
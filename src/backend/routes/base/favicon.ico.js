import path from "path";

export default class FaviconIco {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    res.sendFile(path.join(process.cwd(), "src/assets/img/favicon.ico"));
  }
}
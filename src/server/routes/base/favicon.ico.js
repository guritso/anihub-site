import path from "path";

// skipcq: JS-D1001
export default class FaviconIco {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    const { __web } = req.app.client;

    res.sendFile(path.join(process.cwd(), `${__web}/assets/img/favicon.ico`));
  }
}
// skipcq: JS-D1001
import { URL } from 'url';
import path from 'path';

export default class Redirect {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    const allowedDomains = ['github.com', 'myanimelist.net'];
    const { __web, __dirname } = req.app.client;

    try {
      const url = new URL(req.query.url);
      if (allowedDomains.includes(url.hostname)) {
        res.redirect(req.query.url);
      } else {
        res.sendFile(path.join(__dirname, `${__web}/pages/401.html`));
      }
    } catch (e) {
      res.sendFile(path.join(__dirname, `${__web}/pages/404.html`));
    }
  }
}
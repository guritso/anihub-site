// skipcq: JS-D1001
import { URL } from 'url';

export default class Redirect {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    const allowedDomains = ['github.com', 'myanimelist.net'];

    try {
      const url = new URL(req.query.url);
      if (allowedDomains.includes(url.hostname)) {
        res.redirect(req.query.url);
      } else {
        res.status(401).send({ message: 'Unauthorized' });
      }
    } catch (e) {
      res.status(400).send({ message: 'Invalid URL'});
    }
  }
}
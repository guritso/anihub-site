// skipcq: JS-D1001
export default class Redirect {
  static data = {
    method: 'get',
    base: true
  };

  static handler = (req, res) => {
    res.redirect(req.query.url);
  }
}
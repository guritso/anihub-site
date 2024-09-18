import configLoader from '../../utils/configLoader.js';
/**
 * Checks if the given key matches the API key set in the environment.
 * @param {string} key The key to check.
 * @returns {boolean} Whether the key matches the API key.
 */

function auth(key) {
  return key === process.env.API_KEY;
}
// skipcq: JS-D1001
export default class Config {
  static data = {
    isWildcard: true,
    method: 'get',
  };

  static handler = function (req, res) {
    const params = req.params[0]?.split('/') || [];
    const key = req.headers.authorization?.replace('Bearer ', '');
    const publicAccess = configLoader().security.publicAccess;

    if (!publicAccess.includes(params[0])) {
      if (!auth(key)) {
        return res.status(401).send({ status: res.statusCode, message: 'Unauthorized' });
      }
    }

    let configData = configLoader();

    for (const param of params) {
      configData = configData[param];
    }

    if (configData) {
      return res.send({ status: res.statusCode, data: configData });
    }

    return res.status(404).send({ status: res.statusCode, message: 'Not found' });
  }
};

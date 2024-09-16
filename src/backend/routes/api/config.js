import configLoader from '../../utils/configLoader.js';

const auth = (key) => {
  return (key === process.env.API_KEY);
};

export default class Config {
  static data = {
    isWildcard: true,
    method: 'get',
  };

  static handler = (req, res) => {
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
      res.send({ status: res.statusCode, data: configData });
    } else {
      res.status(404).send({ status: res.statusCode, message: 'Not found' });
    }
  }
};
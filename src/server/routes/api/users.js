const userActions = {
  animelist: (username, req, res) => {
    return res.send({ status: res.statusCode, data: req.app.client.cache.get(username) || [] });
  },
  repos: (username, req, res) => {
    const cachedData = req.app.client.cache.get(`git:${username}`);
    if (cachedData) {
      res.send({ status: res.statusCode, data: cachedData });
    }

    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          throw new Error('API rate limit exceeded');
        }

        const formattedData = data.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          fork: repo.fork,
          archived: repo.archived,
          updated_at: repo.updated_at
        }));

        req.app.client.cache.set(`git:${username}`, formattedData);
        if (res.headersSent) return;
        res.send({ status: res.statusCode, data: formattedData });
      })
      .catch(error => {
        if (res.headersSent) return;
        res.status(500).send({ status: res.statusCode, message: error.message });
      });
  }
};

// skipcq: JS-D1001
export default class Users {
  static data = {
    method: 'get',
    params: ':username/:action'
  };

  static handler = function (req, res) {
    const { username, action } = req.params;

    if (userActions[action.toLowerCase()]) {
      userActions[action.toLowerCase()](username.toLowerCase(), req, res);
    } else {
      res.status(404).send({ status: res.statusCode, message: 'Not found' });
    }
  }
}

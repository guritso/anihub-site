const userActions = {
  animelist: (username, req, res) => {
    return res.send({ status: res.statusCode, data: req.app.locals.cache.get(username) || [] });
  },
  repos: (username, req, res) => {
    const cachedData = req.app.locals.cache.get(`git:${username}`);
    if (cachedData) {
      res.send({ status: res.statusCode, data: cachedData });
    }

    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then(response => response.json())
      .then(data => {
        req.app.locals.cache.set(`git:${username}`, data);
        if (res.headersSent) return;
        return res.send({ status: res.statusCode, data: data });
      })
      .catch(error => {});
  }
}

module.exports = {
  data: {
    method: "get",
    params: ":username/:action"
  },
  handler: async (req, res) => {
    const { username, action } = req.params

    if (userActions[action.toLowerCase()]) {
      userActions[action.toLowerCase()](username.toLowerCase(), req, res)
    } else {
      return res.status(404).send({ status: res.statusCode, message: "Not found" });
    }
  }
};
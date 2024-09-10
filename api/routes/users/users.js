const userActions = {
  animelist: (username, req, res) => {
    return res.send({ status: res.statusCode, data: req.app.locals.cache.get(username) || [] });
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
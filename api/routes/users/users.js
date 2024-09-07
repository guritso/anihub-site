module.exports = {
  data: {
    isWildcard: true,
    method: "get",
  },
  handler: async (req, res) => {
    const params = req.params[0]?.split('/') || []
    const username = params[0]

    if (!req.app.locals.cache.has(username)) {
      return res.status(404).send({ status: res.statusCode, message: "User not found in cache" });
    }

    const animes = await req.app.locals.cache.get(username)

    res.send({ status: res.statusCode, data: animes || [] });
  },
};
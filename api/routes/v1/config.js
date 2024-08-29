const fs = require("fs");
const path = require("path");

const config = require("../../utils/configLoader");


const auth = (key) => {
  if (key === process.env.API_KEY) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  data: {
    isWildcard: true,
    method: "get",
  },
  handler: (req, res) => {
    const params = req.params[0]?.split("/") || [];
    const key = req.headers.authorization?.replace("Bearer ", "");
    const publicAccess = config().security.publicAccess;

    if (!publicAccess.includes(params[0])) {
      if (!auth(key)) {
        return res.status(401).send({ status: res.statusCode, message: "Unauthorized" });
      }
    }

    let configData = config();

    for (const param of params) {
      configData = configData[param];
    }

    if (configData) {
      res.send({ status: res.statusCode, data: configData });
    } else {
      res.status(404).send({ status: res.statusCode, message: "Not found" });
    }
  }
};

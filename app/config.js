require('dotenv').config();

const config = {
  user: {
    name: "GuriZenit",
    description: "Vel nostrum non molestias necessitatibus distinctio iste accusantium alias quia.",
    accounts: {
      github: "gurizenit",
      myanimelist: "gurizenit",
    }
  },
  port: process.env.PORT || 3000
}

module.exports = config
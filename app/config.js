require('dotenv').config();

const config = {
  user: {
    name: "GuriZenit",
    description: "Vel nostrum non molestias necessitatibus distinctio iste accusantium alias quia.",
    accounts: [
      {
        type: "github",
        username: "gurizenit",
        url: "https://github.com/"
      },
      {
        type: "myanimelist",
        username: "gurizenit",
        url: "https://myanimelist.net/profile/"
      }
    ]
  },
  port: process.env.PORT || 3000
}

for (const account of config.user.accounts) {
  account.url += account.username
}

module.exports = config
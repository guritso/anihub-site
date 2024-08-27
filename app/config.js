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
  hosts: [],
  port: process.env.PORT || 3000
}

config.hosts.push(`http://localhost:${config.port}`)

if (process.env.CUSTOM_HOST) {
  config.hosts.push(process.env.CUSTOM_HOST)
}

for (const account of config.user.accounts) {
  account.url += account.username
}

module.exports = config
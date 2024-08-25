require('dotenv').config();

const config = {
    user: {
        name: "GuriZenit",
        github_username: "gurizenit",
        myanimelist_username: "gurizenit",
        description: "Vel nostrum non molestias necessitatibus distinctio iste accusantium alias quia."
    },
    port: process.env.PORT || 3000
}

module.exports = config
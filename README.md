# Animehub

Animehub is a simple site to display your anime and github history using MyAnimeList jikan api and github api.

## Features

- Displays user profile information
- Shows links to social media accounts
- Lists recently watched anime with a scrolling animation
- Displays the user's most recent GitHub repositories

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, 
- APIs: MyAnimeList (via Jikan API), GitHub API

## Configuration

Use `config/config.json` to personalize the site with your own information.
> **Note**: You need to have a MyAnimeList and GitHub account to use the anime synchronization and GitHub repositories features.

### Example config.json

```json
{
  "user": {
    "name": "GuriZenit",
    "description": "I just like code and animes",
    "avatarUrl": "https://avatars.githubusercontent.com/u/77638636?v=4",
    "accounts": {
      "github": {
        "username": "gurizenit",
        "url": "https://github.com/gurizenit",
        "color": "#2a313b"
      },
      "myanimelist": {
        "username": "gurizenit",
        "url": "https://myanimelist.net/profile/GuriZenit",
        "color": "#272b4e"
      }
    }
  },
  "anime": {
    "limit": 100,
    "rowSpeed": 0.6,
    "madotsuki": {
      "enabled": false
    }
  },
  "repos": {
    "limit": 100,
    "fork": false,
    "archived": false,
    "blacklist": ["GuriZenit"]
  },
  "animeSync": {
    "enabled": true,
    "syncInterval": 60000,
    "animeInterval": 1000,
    "verbose": false
  },
  "security": {
    "publicAccess": ["user", "anime", "repos"],
    "newKeyOnStart": false,
    "showKeyOnStart": false
  },
  "port": 3000
}
```

- `user`: Profile information and social media accounts that will be displayed as a button.
  - `accounts`: **github** and **myanimelist** are needed to sync the anime history and github repositories.
  - > you can add more accounts as you like.
- `anime`: Settings for anime display, including limit and scroll speed
  - `madotsuki`: Try enabling it.
- `repos`: GitHub repository display settings, including limit and filters
- `animeSync`: Configuration for the anime synchronization service that saves the history locally.
  - `animeInterval`: 1000 (1 second) to avoid rate limiting.
- `security`: Not important at all.
  - `publicAccess`: The endpoints that are public and can be accessed without an API key at `api/v1/config/{endpoint}`.
  - `newKeyOnStart`: If true, a new API key will be generated on server start.
  - `showKeyOnStart`: If true, the API key will be displayed in the console on server start.
  - > the key will be saved in the .env file.
- `port`: The port on which the server will run

## Setup
> **Note**: yarn used is the [berry version](https://yarnpkg.com/getting-started/install).

```bash
# Clone the repository
git clone https://github.com/gurizenit/animehub.git
cd animehub

# Install dependencies
npm install
# or
yarn
# Start the server
npm run start
# or
yarn start
```

## Links

- [Jikan API](https://jikan.moe/)

## License

[MIT](./LICENSE).
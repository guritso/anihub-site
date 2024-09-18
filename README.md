# Animehub

Animehub is a simple site to display your anime and github history using MyAnimeList jikan api and github api.

## Features

- Displays user profile information
- Shows links to social media accounts
- Lists recently watched anime with a scrolling animation
- Displays the user's most recent GitHub repositories

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, cors, express-rate-limit
- APIs: GitHub API, MyAnimeList (via load.json anime file)

## Configuration

> **Note**: You need to have a MyAnimeList and GitHub account to use the anime synchronization and GitHub repositories features.

Use `src/config/config.json` to personalize it with your informations. see [config guide](./docs/CONFIG.md) for more information.

## Setup
> **Note**: yarn used is the [berry version](https://yarnpkg.com/getting-started/install).

```bash
# Clone the repository
git clone https://github.com/GuriTsuki/anihub-site.git
cd anihub-site

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

[MyAnimeList](https://myanimelist.net/)

## License

[MIT](./LICENSE).
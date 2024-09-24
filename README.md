# Animehub

Animehub is a simple site to display your anime and github history using MyAnimeList and github api.

## Features

- Displays user profile information
- Shows links to social media accounts
- Lists recently watched anime with a scrolling animation
- Displays the user's most recent GitHub repositories

## Dependencies

### Packages
- node.js
- express.js
- cors
- express-rate-limit
- @guritso/terminal

### APIs
- GitHub API
- MyAnimeList (via load.json anime file)

## Configuration

> **Note**: You need to have a MyAnimeList and GitHub account to use the anime synchronization and GitHub repositories features.

You can use the setup script:

```bash
yarn setup
# or
npm run setup
```

And use `src/config/config.json` to personalise it. see [config guide](./docs/CONFIG.md) for more information.

## Setup
> **Note**: yarn used is the [berry version](https://yarnpkg.com/getting-started/install).

```bash
# Clone the repository
git clone https://github.com/guritso/anihub-site.git
cd anihub-site
# You can use the setup script
yarn setup
# or
npm run setup
# Install dependencies (setup already do it)
yarn
# or
npm install
# Start the server
yarn start
# or
npm run start
```

## Links

[MyAnimeList](https://myanimelist.net/)

## License

[MIT](./LICENSE).
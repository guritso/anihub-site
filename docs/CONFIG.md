# Quick Config Guide

This doc will help you understand the `config.json`, if you need to create `src/config/config.json`. You can check [this file](/src/config/config.example.json) as an example template.

## What's in here?

- [Your Info](#your-info)
- [Theme](#theme)
- [Anime Settings](#anime-settings)
- [Repo Settings](#repo-settings)
- [Anime Sync](#anime-sync)
- [Server](#server)
- [Security](#security)
- [Server Port](#server-port)

### Your Info

This is where you put your personal data e links de redes sociais.

| Key | Description | default | options | type |
|-----|-------------|---------|---------|------|
| **name** | Your username | | | string |
| **description** | A brief description about you | | | string |
| **avatarUrl** | Link to your profile picture | | | string |
| **accounts** | Social media links that will be displayed as buttons | github, myanimelist | any | object |

> Github and MyAnimeList are required. You can add more if you want using [this format](https://guritsuki.site/api/config/user).

### Theme

| Key | Description | default | options | type |
|-----|-------------|---------|---------|------|
| **color** | Themes in 'src/assets/css/themes' | default | default, material, dracula, forest, gruvbox, pastel, solarized, nord | string |
| **type** | Light or dark color theme version | dark | dark, light | string

### Anime Settings

| Key | Description| default | options | type |
|-----|------------|---------|---------|------|
| **limit** | Number of animes to display | 30 | 0 - 26417 | number |
| **rowSpeed** | Animation speed of the row | 0.6 | 0 - 100 | number |
| **filters.status** | Anime statuses to include | "watching", "completed" | on hold, dropped, plan to watch | array of strings |
| **filters.watchingFirst** | Show watching animes first? | true | true, false | boolean |

### Repo Settings

| Key | Description | default | options | type |
|-----|-------------|---------|---------|------|
| **limit** | Maximum number of repositories to display. | 50 | 0 - unlimited | number |
| **fork** | Include forked repositories? | false | true, false | boolean |
| **archived** | Show archived repositories? | false | true, false | boolean |
| **blacklist** | Repositories you wish to hide | [] | "repo-name-1", "repo-name-2" | array of strings |

### Anime Sync

| Key | Description | default | options | type |
|-----|-------------|---------|---------|------|
| **enabled** | Enable/disable synchronization. | true | true, false | boolean |
| **syncInterval**| Interval for synchronization in milliseconds. | 120000 | 60000 - unlimited | number |

### Server

| Key | Description | default | options | type |
|-----|-------------|---------|---------|------|
| **verbose** | Do you want detailed logs? | 1 | 0, 1, 2 | number |
| **host** | Host to run the server on. | localhost | any host | string |
| **port** | Port to run the server on. | 3000 | 1024 - 65535 | number |

> You can delete the host and port keys. and add to a `.env` file as `PORT=your-port` and `HOST=your-host`.

### Security

> It is not recommended to change. Actually, it's not that important.

| Key | Description | default | options | type |
|-----|-------------|---------|---------|------|
| **publicAccess** | Which parts of 'config.json' anyone can see through the API | "anime", "user", "theme" | any part of the config.json | array of strings |
| **newKeyOnStart** | Generate a new key on start? | false | true, false | boolean |
| **showKeyOnStart**| Show the security key on startup? | false | true, false | boolean |


# Quick Config Guide

This doc will help you understand the `config.json` file located in `src/config/config.json`.

## What's in here?

- [Your Info](#your-info)
- [Theme](#theme)
- [Anime Settings](#anime-settings)
- [Repo Settings](#repo-settings)
- [Anime Sync](#anime-sync)
- [Security](#security)
- [Server Port](#server-port)

### Your Info

This is where you put your personal data and social media links.

- **name**: Your name
- **description**: A short blurb about you
- **avatarUrl**: Link to your profile pic
- **accounts**: Your `GitHub` and `MyAnimeList` are required. You can add more if you want using the format:

```json
...
  "social-media": {
    "username": "your-social-media-username",
    "url": "https://social-media.com/link-to-your-profile",
    "color": "#2a313b" // button color
  }
...

```

### Theme

- **default**: themes on `src/assets/css/themes` folder. `light` `dark` `dracula` `forest` `gruvbox` `pastel` `solarized`, etc.

### Anime Settings

- **limit**: How many anime to show. default: `30`
- **rowSpeed**: How fast the rows animate. default: `0.6`
- **filters.status**: Which anime statuses to include, as default: `["watching", "completed"]` others `on hold`, `dropped`, `plan to watch`.

### Repo Settings

- **limit**: Max number of repos to show. default: `50`
- **fork**: Include forked repos? default: `false`
- **archived**: Show archived repos? default: `false`
- **blacklist**: Repos you want to hide, as `["repo-name-1", "repo-name-2"]`

### Anime Sync

- **enabled**: Turn sync on/off. default: `true`
- **syncInterval**: How often to sync (in milliseconds). default: `120000` 2 minutes recommended
- **verbose**: Want detailed logs? default: `false`

### Security
> Not recommended to change, actually this is not so important.
- **publicAccess**: Which parts of config.json anyone can see through the api: `["anime", "user"]`
- **newKeyOnStart**: Generate a new key when starting up? default: `false`
- **showKeyOnStart**: Show the security key on startup? default: `false`

### Server Port

- **port**: Which port to run on. default: `3000`

---
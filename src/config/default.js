const user = {
  name: "anyone",
  description: "create a config.json on src/config/config.json!",
  avatarUrl: "",
  accounts: {
    github: {
      username: "",
      url: "",
      color: "#000000",
    },
    myanimelist: {
      username: "",
      url: "",
      color: "#000000",
    },
  },
};

const theme = {
  default: "dark",
};

const anime = {
  limit: 30,
  rowSpeed: 0.6,
  filters: {
    status: ["watching", "completed"],
  },
};

const repos = {
  limit: 50,
  fork: false,
  archived: false,
  blacklist: [],
};

const animeSync = {
  enabled: true,
  syncInterval: 120000,
  verbose: 1,
};

const security = {
  publicAccess: ["anime", "user"],
  newKeyOnStart: false,
  showKeyOnStart: false,
};

const port = process.env.PORT || 3000;

export default {
  user,
  theme,
  anime,
  repos,
  animeSync,
  security,
  port,
};

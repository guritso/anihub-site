const config = {
  user: {
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
  },
  theme: {
    default: "dark",
  },
  anime: {
    limit: 30,
    rowSpeed: 0.6,
    filters: {
      status: ["watching", "completed"],
    },
  },
  repos: {
    limit: 50,
    fork: false,
    archived: false,
    blacklist: [],
  },
  animeSync: {
    enabled: true,
    syncInterval: 120000,
    verbose: 1,
  },
  security: {
    publicAccess: ["anime", "user"],
    newKeyOnStart: false,
    showKeyOnStart: false,
  },
  port: process.env.PORT || 3000,
};

export default config;

const config = {
  user: {
    name: "anyone",
    description: "use the setup comand: 'npm run setup'",
    avatarUrl: "",
    accounts: {
      github: {
        username: "",
        url: "",
        color: "#2a313b",
      },
      myanimelist: {
        username: "",
        url: "",
        color: "#272b4e",
      },
    },
  },
  theme: {
    color: "default",
    type: "dark",
  },
  anime: {
    limit: 30,
    rowSpeed: 0.6,
    filters: {
      status: ["watching", "completed"],
      watchingFirst: true,
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
  },
  server: {
    verbose: 1,
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
  },
  security: {
    publicAccess: ["anime", "user", "theme"],
    newKeyOnStart: false,
    showKeyOnStart: false,
  },
};

export default config;

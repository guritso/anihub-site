import { execSync } from "child_process";
import config from "../misc/default.js";
import configChanger from "./configChanger.js";
import { texter as h } from "./texter.js";
import { readFileSync, writeFileSync, readdirSync } from "fs";

const { stdin, exit } = process;
const { myanimelist, github } = config.user.accounts;
// skipcq: JS-D1001
const clean = () => stdin.write("\r\x1b[2K");

/**
 * This function is used to prompt the user for input
 * @param {string} question - The question to ask the user
 * @returns {Promise<string>} - The user's input
 */
function prompt(question = "") {
  stdin.write(question);

  return new Promise((resolve) => {
    stdin.once("data", (data) => {
      resolve(String(data).trim());
    });
  });
}

/**
 * This function is used to verify if the user exists
 * @param {string} url - The URL to fetch the user
 * @param {string} username - The username to fetch
 * @returns {string} - The user username
 */
async function fetchUser(url, username) {
  stdin.write(h(`%H93 ➤ │ verifing: ${username} %H5 ···`));

  const res = await fetch(`${url}${username}`).catch(() => {
    return { ok: false };
  });

  clean();

  if (!username) {
    res.status = 404;
  }

  if (!res.ok || res.status === 404) {
    const err = res.status === 404 ? "user not found" : "connection error";

    await prompt(h(`\r%H91 ➤ │ ${err}, %H2 continue? %H36 y/n %H(y): `)).then(
      (response) => {
        if (response.toLowerCase().startsWith("n")) {
          stdin.write(h("%H91 ➤ └ %H37 sync step canceled\n"));
          exit();
        }
      }
    );
  } else {
    stdin.write(h(`%H92 ➤ │ sucess: ${username} exists\n`));
  }

  return username;
}

/**
 * This function is used to install the dependencies
 * @param {string} manager - The package manager to install the dependencies
 */
async function install(manager) {
  stdin.write(h(`%H93 ➤ │ installing with ${manager}\n`));

  try {
    if (manager === "pnpm") {
      const json = JSON.parse(readFileSync("./package.json", "utf-8"));

      delete json.packageManager;

      writeFileSync("./package.json", JSON.stringify(json, null, 2));
    }

    execSync(`${manager} install`, { stdio: "inherit" });

    clean();
  } catch (err) {
    clean();

    const retry = await prompt(
      h("%H91 ➤ │ error installing, try again %H34 y/n %H(y): ")
    );

    if (!retry.toLowerCase().startsWith("n")) {
      await install(manager);
    }
  }
}

const MAL_URL = "https://myanimelist.net/profile/";
const GIT_URL = "https://github.com/";
const MANAGERS = ["pnpm", "yarn", "npm"];

stdin.write(h(`\n%H104 ${h("%H1 » aniHub setup script «%H")}%H\n\n`));

stdin.write(h("%H94 ➤ ┌ %H37 sync step\n"));

if (readdirSync("src/config").includes("config.json")) {
  const res = await prompt(
    h("%H93 ➤ │ there's a config.json file, overwrite?%H y/n (n): ")
  );

  if (!res.toLowerCase().startsWith("y")) {
    stdin.write(h("%H91 ➤ └ %H37 sync step canceled\n"));
    exit();
  }
}

const malUser = await prompt(
  h("%H94 ➤ │ %H2 myanimelist %H36 username: ")
).then((user) => fetchUser(MAL_URL, user));

myanimelist.username = malUser;
myanimelist.url = MAL_URL + malUser;

const gitUser = await prompt(h("%H94 ➤ │ %H2 github %H36 username: ")).then(
  (user) => fetchUser(GIT_URL, user)
);

github.username = gitUser;
github.url = GIT_URL + gitUser;

stdin.write(h("%H94 ➤ └ %H37 sync step completed\n"));
stdin.write(h("%H94 ➤ ┌ %H37 profile step\n"));

config.user.name = await prompt(
  h(`%H94 ➤ │ %H2 profile %H36 name%H (${gitUser}): `)
).then((name) => name || gitUser);
config.user.description = await prompt(
  h("%H94 ➤ │ %H2 profile %H36 description: ")
);
config.user.avatarUrl = await prompt(
  h("%H94 ➤ │ %H2 profile %H36 picture url: ")
);

configChanger.change(["user"], config.user);

stdin.write(h("%H92 ➤ │ sucess: src/config/config.json saved\n"));
stdin.write(h("%H94 ➤ └ %H37 profile step completed\n"));
stdin.write(h("%H94 ➤ ┌ %H37 installation step\n"));

const pManager = await prompt(
  h(`%H94 ➤ │ %H2 package %H36 manager, %H35 ${MANAGERS.join("/")}%H (yarn): `)
).then((res) => MANAGERS.find((i) => res.toLowerCase() === i) || "yarn");

const proced = await prompt(
  h(`%H94 ➤ │ %H2 proced with %H35 ${pManager}? %H36 y/n %H(y): `)
);

if (!proced.toLowerCase().startsWith("n")) {
  await install(pManager);
  stdin.write(
    h(
      `%H92 ➤ │ sucess: use %H32 ${
        pManager === "npm" ? "npm run" : pManager
      } start\n`
    )
  );
  stdin.write(h("%H94 ➤ └ %H37 installation step completed\n"));
} else {
  stdin.write(h("%H91 ➤ └ %H37 installation step canceled\n"));
}

exit();

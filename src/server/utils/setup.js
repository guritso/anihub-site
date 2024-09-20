import childProcess from "child_process";
import config from "../misc/default.js";
import configChanger from "./configChanger.js";
import { texter as h } from "./texter.js"

const { stdin,  exit } = process;
const { myanimelist, github } = config.user.accounts;

function prompt(question = "") {
  const [s, f, ...l] = question.split(" ");

  question = question.replace(l.join(" "), h(`%H2 ${l.join(" ")}%H`))
    .replace(s, h(`%H34 ${s}%H`))
    .replace(f, h(`%H1 ${f}%H`))

  stdin.write(question);

  return new Promise((resolve) => {
    stdin.once("data", (data) => {
      resolve(String(data).trim());
    });
  });
}

async function fetchUser(url, username = "github") {
  stdin.write(`${h("%H33 ↺%H")} verifing ${username}...`);

  const res = await fetch(`${url}${username}`).catch(() => {
    return { ok: false };
  });

  if (!username) {
    res.status = 404;
  }

  if (!res.ok || res.status === 404) {
    const err = res.status === 404 ? "%H31 user not found%H" : "%H31 connection error%H";

    await prompt(`\r${h("%H31 ✗%H")} ${h(err)}, continue? y/n (y): `).then((res) => {
      if (res.toLowerCase() === "n") {
        console.log("» exiting...");
        exit();
      }
    });
  }

  stdin.write("\r\x1b[2K");

  return username;
}

function install(manager) {
  stdin.write(`${h("%H33 ↺%H")} installing with ${manager}\n`);

  try {
    childProcess.execSync(`${manager} install`, { stdio: "inherit" });
  } catch (err) {
    const retry = prompt(`${h("%H31 ✗%H")} erro on installation, try again y/n (y): `)

    if (retry === "y") {
      install(manager)
    }
  }
}

const MAL_URL = "https://myanimelist.net/profile/";
const GIT_URL = "https://github.com/";
const MANAGERS = ["yarn", "npm"];

const title = "aniHub setup script";
const bar = "*".repeat(title.length + 4);

stdin.write(`\n${bar}\n* ${title} *\n${bar}\n\n`);

const malUser = await prompt("➤ myanimelist username: ").then((user) =>
  fetchUser(MAL_URL, user)
);

myanimelist.username = malUser;
myanimelist.url = MAL_URL + malUser;

const gitUser = await prompt("➤ github username: ").then((user) =>
  fetchUser(GIT_URL, user)
);

github.username = gitUser;
github.url = GIT_URL + gitUser;

config.user.name = await prompt(`➤ profile name (${gitUser}): `).then(
  (name) => name || gitUser
);
config.user.description = await prompt(`➤ profile description: `);
config.user.avatarUrl = await prompt(`➤ profile picture url: `);

configChanger.change(["user"], config.user);

console.log(`${h("%H92 ✓ saved on src/config/config.json%H")}`);

const pManager = await prompt(
  `➤ package manager, ${MANAGERS.join("/")} (npm): `
).then((res) => MANAGERS.find((i) => res.toLowerCase() === i) || "npm");

const proced = await prompt("➤ proced with installation? y/n (y): ");

if (proced !== "n") {
  install(pManager);
}

stdin.write(
  `${h("%H32 ✓%H")} setup complete, use ${pManager === "npm" ? "npm run" : pManager} start\n`
);

exit();

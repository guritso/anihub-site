const arr = ["C 36m", "Y 33m", "R 31m", "G 32m", "B 1m", "U 4m", "I 3m"];
const co = {};
let v = 2;

for (const a of arr) {
  const i = "\x1b[";
  const [k, c] = a.split(" ");
  co[k] = (...s) => `${i}${c}${s.join("")}${i}0m`;
}

function hl(txt) {
  return txt.replace(/%([CGYRBUI])(.*?)%/g, (match, p1, p2) => {
    return co[p1] ? co[p1](p2) : match;
  });
}

async function print(...args) {
  if (v <= 0) return;

  let log = [];
  for (const a of args) {
    if (typeof a === "function") {
      try {
        await a();
      } catch (e) {
        args.push(e);
      }
      continue;
    }

    if (typeof a === "object" && a !== null) {
      const error = v >= 2 ? a.stack : "Error: " + a.message;

      if (error) {
        console.error(log.join(" ") + error);
        log = [];
      } else {
        console.log(log.join(" "), a);
        log = [];
      }
      continue;
    }

    log.push(a);
  }

  if (log.length) {
    const txt = log.join(" ").replaceAll("%SA", "");
    if (log.join("").includes("%SA") && v == 1) {
      process.stdout.write("\x1b[2K");
      process.stdout.write(hl(txt) + "\r");
    } else {
      console.log(hl(txt));
    }
  }
}

function setVerbose(verbose) {
  v = verbose;
  return print;
}

export { print, setVerbose };

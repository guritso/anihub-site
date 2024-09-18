const arr = ["C 36m", "Y 33m", "R 31m", "G 32m", "B 1m", "U 4m", "I 3m"];
const co = {};
let vb = 2;

for (const a of arr) {
  const i = "\x1b[";
  const [k, c] = a.split(" ");
  co[k] = (...s) => `${i}${c}${s.join("")}${i}0m`;
}

/**
 * Replaces all occurrences of %X...% in a string with the corresponding ANSI escape code.
 * @param {string} txt - The string to replace.
 * @returns {string} The modified string.
 */
function hl(txt) {
  return txt.replace(/%([CGYRBUI])(.*?)%/g, (match, p1, p2) => {
    return co[p1] ? co[p1](p2) : match;
  });
}

/**
 * Logs a message or multiple messages to the console.
 * @param {...(string|Error|Function|Object)} args - The messages to log. If a function is passed,
 * it will be called and if it returns a promise, it will be awaited before logging.
 * If an object is passed, if the verbosity level is 2 or higher, the error stack will be logged,
 * otherwise the error message will be logged. If the object is not an error, it will be logged as is.
 * If the verbosity level is 1, the messages will be printed on the same line, overwriting the previous
 * line.
 */
async function print(...args) {
  if (vb <= 0) return;

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
      const error = vb >= 2 ? a.stack : `${a.message.includes("Error:") ? "" : "Error:"} ${a.message}`;

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
    if (log.join("").includes("%SA") && Number(vb) === 1) {
      process.stdout.write("\x1b[2K");
      process.stdout.write(`${hl(txt)} \r`);
    } else {
      console.log(hl(txt));
    }
  }
}

/**
 * Sets the verbosity level of the logger.
 * @param {number} verbose - Verbosity level. 0: off, 1: on, 2: detailed.
 * @returns {function(...*): Promise<void>} - The print function.
 */
function setVerbose(verbose) {
  vb = verbose;
  return print;
}

export { print, setVerbose };

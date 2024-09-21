import { texter as tx } from "../utils/texter.js";
import configLoader from "../utils/configLoader.js";

const { stdout } = process;

/**
 *  display the head of the terminal
 *
 * @param {number} port
 * @param {{ name: string, version: string }} data
 */
function head(port, { name, version }) {
  const headLines = [
    `\n%H44  ${name} `,
    `%H41  version: ${version} %H\n`,
    `%H43  host:%H95  http://localhost:${port}\n`,
    `%H45  port:%H94  ${port}\n`,
  ];

  for (const line of headLines) {
    stdout.write(tx(line));
  }
}

/**
 *  display the online message
 *
 * @param {string} data
 */
function online() {
  stdout.clearLine();
  stdout.write(tx("\r%H42  site:%H96  online!\n"));
}

/**
 *  display logs messages
 *
 * @param {string} data
 */
function log(data) {
  const { verbose } = configLoader().server;
  let i = 100;
  let type = "logs";

  if (Number(verbose) === 0) return;

  if (data.stack) {
    i = 41;
    type = "erro";
  }

  if (Number(verbose) === 1) {
    stdout.clearLine();
    stdout.write(tx(`\r%H${i}  ${type}:%H ${data}`));
  } else {
    stdout.write(tx(`%H${i}  ${type}:%H `));

    if (type === "logs") {
      stdout.write(`${tx(data)}\n`);
    } else {
      console.error(data);
    }
  }
}

export default { head, online, log };

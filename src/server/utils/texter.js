export const texter = (txt) => {
  const arr = txt.split("%H");
  let res = arr.join("");

  for (const a of arr) {
    const [n, ...w] = a.split(" ");

    if (!n || !txt.includes(`%H${n}`) || isNaN(n)) continue;

    const mo = `\x1b[${n}m${w.join(" ")}\x1b[0m`;

    res = res.replace(a, mo);
  }

  return res;
};

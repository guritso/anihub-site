export const texter = (txt) => {
  const arr = txt.split("%H");
  let res = txt;

  for (const a of arr) {
    const [n, ...w] = a.split(" ");

    res = res.replace(
      `%H${n} ${w.join(" ")}%H`,
      `\x1b[${n}m${w.join(" ")}\x1b[0m`
    );
  }

  return res;
};

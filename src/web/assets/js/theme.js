document.addEventListener("DOMContentLoaded", async () => {
  const type = await fetch("api/config/theme")
    .then((response) => response.json())
    .then(({ data }) => data.type);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
    setTheme(document.body.className);
  });

  if (!["dark", "light"].includes(type)) return;

  loadTheme(type);
});
// skipcq: JS-0105
function setTheme(theme) {
  localStorage.setItem("theme", theme);
  document.body.className = theme;
}
// skipcq: JS-0105
function loadTheme(type) {
  const theme = localStorage.getItem("theme");

  if (theme == "undefined") return;

  document.body.className = theme || `${type}-theme`;
}

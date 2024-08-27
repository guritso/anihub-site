document.addEventListener('DOMContentLoaded', async () => {
  const userInfo = await getUserInfo();
  const animeList = await getAnimeHistory(userInfo.accounts.find(a => a.type === "myanimelist").username);
  const animeListData = await animeList.json();

  // profile layout
  const profileInfo = document.getElementById('profile-info');

  profileInfo.innerHTML = `
    <h1>${userInfo.name}</h1>
    <h2>${userInfo.description}</h2>
    `;

  // social layout
  const socialLayout = document.getElementById('social-layout');

  userInfo.accounts.forEach(account => {
    socialLayout.innerHTML += `
      <a class="button" id="${account.type}-button" target="_blank" href="${account.url}">${account.type}</a>
    `;
  });

  // anime layout
  const animeContainer = document.getElementById('anime-container');

  for (const anime of animeListData.data) {
    animeContainer.innerHTML += `
      <a class="anime-card" href="${anime.link}" target="_blank" style="background-image: url(${anime.image})">
      <p id="anime-title">${anime.title}</p>
      <p id="anime-date">${anime.user.dateFormatted}</p>
      </a>
    `;
  }

  animeContainer.innerHTML += animeContainer.innerHTML;
  animeContainer.style.animation = "scroll 30s infinite linear";
});

async function getUserInfo() {
  return await fetch(`/api/user`).then(res => res.json());
}

async function getAnimeHistory(username) {
  const animeList = await fetch(`/api/userupdates?username=${username}&completed=true`).catch(e => { });
  return animeList || { data: [] };
}
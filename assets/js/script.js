document.addEventListener('DOMContentLoaded', async () => {
  const HOST = "http://localhost:3000"
  const userInfo = await getUserInfo();
  const animeList = await getAnimeHistory(userInfo.accounts.myanimelist);
  const animeListData = await animeList.json();

  const profileLayout = document.getElementById('profile-info');

  profileLayout.innerHTML = `
    <h1>${userInfo.name}</h1>
    <h2>${userInfo.description}</h2>
    `;

  const animeLayout = document.getElementById('anime-container');

  for (const anime of animeListData.data) {
    animeLayout.innerHTML += `
      <a class="anime-card" href="${anime.link}" target="_blank" style="background-image: url(${anime.image})">
      <p id="anime-title">${anime.title}</p>
      <p id="anime-date">${anime.user.dateFormatted}</p>
      </a>
    `;
  }
  // add a copy of all animeLayout elements so the scrool animation -50% works
  animeLayout.innerHTML += animeLayout.innerHTML;
  animeLayout.style.animation = "scroll 30s infinite linear";
});

async function getUserInfo() {
  return await fetch('http://localhost:3000/api/user').then(res => res.json());
}

async function getAnimeHistory(username) {
  const animeList = await fetch(`http://localhost:3000/api/userupdates?username=${username}&completed=true`).catch(e => { });
  return animeList || { data: [] };
}
document.addEventListener('DOMContentLoaded', async () => {
  const userInfo = await getConfigs("user").then(res => res.data);
  const animeList = await getAnimeHistory(userInfo.accounts.myanimelist.username);
  const profilePicture = document.getElementById("profile-picture");
  const headLayouts = document.querySelectorAll(".head-layouts");

  document.title = userInfo.name;
  profilePicture.src = userInfo.avatarUrl;

  // Profile layout
  const profileInfo = document.getElementById('profile-info');
  profileInfo.innerHTML = `
    <h1>${userInfo.name}</h1>
    <h2>${userInfo.description}</h2>
  `;
  headLayouts[0].style.display = "flex";

  // Social layout
  const socialContainer = document.getElementById('social-container');
  for (const key in userInfo.accounts) {
    const acc = userInfo.accounts[key];
    socialContainer.innerHTML += `
      <a class="button" id="${key}-button" target="_blank" style="background-color: ${acc.color};" href="${acc.url}">${key}</a>
    `;
  }
  headLayouts[1].style.display = "flex";
  // Animes layout
  const h3 = document.createElement("h3");
  h3.innerText = "Last watched animes";
  headLayouts[2].before(h3);

  const animeConfig = await getConfigs("anime").then(res => res.data);
  const animeContainer = document.getElementById('anime-container');
  if (animeList?.data) {
    for (const [index, anime] of animeList.data.entries()) {
      const status = anime.user.completed ? "Completed" : "Watching";
      if (index >= animeConfig.limit) break;
      animeContainer.innerHTML += `
        <a class="anime-card" href="${anime.link}" target="_blank" style="background-image: url(${anime.image})">
          <p class="anime-status" id="${status.toLowerCase()}">${status}</p>
          <p id="anime-title">${anime.title}</p>
          <p id="anime-date">${new Date(anime.user.date)}</p>
        </a>
      `;
    }
  }

  const length = animeContainer.querySelectorAll(".anime-card").length;
  if (length > 5) {
    
    if (animeConfig.madotsuki.enabled) {
      const madotsuki = document.createElement("div");
      madotsuki.className = "anime-card";
      madotsuki.id = "madotsuki";
      animeContainer.appendChild(madotsuki);
    }
    
    animeContainer.innerHTML += animeContainer.innerHTML;
    animeContainer.style.animation = `scroll ${length / animeConfig.rowSpeed}s infinite linear`;
  }
  headLayouts[2].style.display = "flex";

  const h3clone = h3.cloneNode(true);
  h3clone.innerText = "Github repositories";
  headLayouts[2].after(h3clone);

  headLayouts[3].style.display = "flex";
  headLayouts[4].style.display = "flex";
});

// functions
const apiUrl = "/api/v1";

async function getConfigs(params) {
  return await fetch(`${apiUrl}/config/${params}`).then(res => res.json());
}

async function getAnimeHistory(username) {
  return await fetch(`${apiUrl}/user/${username}`).then(res => res.json());
}

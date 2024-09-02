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
      const date = new Date(anime.user.date);
      animeContainer.innerHTML += `
        <a class="anime-card" href="${anime.link}" target="_blank" style="background-image: url(${anime.image})">
          <p class="anime-status" id="${status.toLowerCase()}">${status}</p>
          <p id="anime-title">${anime.title}</p>
          <p id="anime-date">${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0, 5)}</p>
        </a>
      `;
    }
  }

  const length = animeContainer.querySelectorAll(".anime-card").length;
  if (length > 5) {
    if (animeConfig.madotsuki.enabled) {
      const madotsuki = createElement({ tag: "div", className: "anime-card", id: "madotsuki" });
      animeContainer.appendChild(madotsuki);
      const preload = createElement({ tag: "div", className: "preload", id: "preload" });
      animeContainer.before(preload);
    }

    animeContainer.innerHTML += animeContainer.innerHTML;
    animeContainer.style.animation = `scroll ${length / animeConfig.rowSpeed}s infinite linear`;
  }
  headLayouts[2].style.display = "flex";

  const h3clone = h3.cloneNode(true);
  h3clone.innerText = "Github repositories";
  headLayouts[2].after(h3clone);

  const repos = await getRepos(userInfo.accounts.github.username);
  const reposContainer = document.getElementById('repos-container');
  const reposConfig = await getConfigs("repos").then(res => res.data);

  if (repos?.length) {
    const filteredRepos = repos
      .filter(repo => {
        if (!reposConfig.fork && repo.fork) return false;
        if (!reposConfig.archived && repo.archived) return false;
        if (reposConfig.blacklist.includes(repo.name)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, reposConfig.limit);

    filteredRepos.forEach(repo => {
      const repoElement = document.createElement('a');
      repoElement.className = 'repo-button';
      repoElement.href = repo.html_url;
      repoElement.target = '_blank';

      repoElement.innerHTML = `
        <h4>${repo.name}</h4>
        <p>${repo.description || "No description"}</p>
        <div class="repo-info">
          <span class="repo-language">${repo.language || "N/A"}</span>
          <span class="repo-stars">${repo.stargazers_count}</span>
        </div>
      `;

      reposContainer.appendChild(repoElement);
    });
  }

  headLayouts[3].style.display = "flex";
});

// functions
const apiUrl = "/api/v1";

async function getConfigs(params) {
  return await fetch(`${apiUrl}/config/${params}`).then(res => res.json());
}

async function getAnimeHistory(username) {
  return await fetch(`${apiUrl}/user/${username}`).then(res => res.json());
}

async function getRepos(username) {
  return await fetch(`https://api.github.com/users/${username}/repos`).then(res => res.json());
}

function createElement(obj) {
  const element = document.createElement(obj.tag);
  for (const key in obj) {
    element[key] = obj[key];
  }

  return element;
}
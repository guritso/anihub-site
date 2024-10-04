// skipcq: JS-D1001
export default class AnimesCards {
  static render = (config, cache) => {
    const { username } = config.user.accounts.myanimelist;
    const animes = cache.get(`animes:${username.toLowerCase()}`) || [];

    return animes
      .filter((anime) => config.anime.filters.status.includes(anime.user.status))
      .slice(0, config.anime.limit)
      .map((anime) => `
        <a class="anime-card" href="redirect?url=${encodeURIComponent(anime.link)}" target="_blank">
          <img class="anime-card-image" src="${anime.image}" alt="${anime.title}">
          <div class="anime-card-overlay">
            <div class="anime-card-title">${anime.title}</div>
            <div class="anime-card-info">
              <span>Ep: ${anime.user.increment} / ${anime.episodes || '?'}</span>
              <span>Score: ${anime.user.score || 'N/A'}</span>
            </div>
          </div>
          <div class="anime-status ${anime.user.status.replaceAll(' ', '-')}">${anime.user.status}</div>
        </a>
      `)
      .join('');
  }
}
// skipcq: JS-D1001
export default class AnimesCards {
  static render = (config, cache) => {
    const { username } = config.user.accounts.myanimelist;
    const animes = cache.get(`animes:${username.toLowerCase()}`) || [];

    return animes
      .sort((a, b) => {
        if (config.anime.filters.watchingFirst) {
          if (a.user.status === 'watching' && b.user.status === 'watching') {
            return b.user.date - a.user.date;
          }
          return a.user.status === 'watching' ? -1 : b.user.status === 'watching' ? 1 : 0;
        }
        return 0;
      })
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
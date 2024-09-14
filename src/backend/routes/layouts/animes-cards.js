export default class AnimesCards {
  static render = (config, cache) => {
    const { username } = config.user.accounts.myanimelist;
    const animesCards = cache.get(username.toLowerCase()) || [];

    return  animesCards.filter((anime) => config.anime.filters.status.includes(anime.user.status)).map((anime, i) => i >= config.anime.limit ? "" :
    `<a class="anime-card" href="redirect?url=${encodeURIComponent(anime.link)}" target="_blank" style="background-image: url(${anime.image})">`
      + `<p class="anime-status" id="${anime.user.status.replace(' ', '-')}">${anime.user.status}</p>`
      + `<p id="anime-title">${anime.title}</p>`
      + `<p id="anime-date">${anime.user.date.toTimeString().slice(0, 5)}  ${anime.user.date.toDateString()}</p>`
      + `</a>`
    ).join('');
  }
}
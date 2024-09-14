export default class ReposCards {
  static render = (config, cache) => {
    const { username } = config.user.accounts.github;
    const reposCards = cache.get(`git:${username.toLowerCase()}`) || [];

    return reposCards
      .filter((repo, index) => {
        const isArchivedMatch = config.repos.archived ? true : !repo.archived;
        const isForkMatch = config.repos.fork ? true : !repo.fork;

        return (
          index < config.repos.limit &&
          !config.repos.blacklist.includes(repo.name) &&
          isArchivedMatch &&
          isForkMatch
        );
      }).map((repo) => `<a class="repo-button" href="redirect?url=${encodeURIComponent(repo.url)}" target="_blank">`+
          `<h4>${repo.name}</h4>` +
          `<p>${repo.description || "No description"}</p>` +
          `<div class="repo-info">` +
          `<span class="repo-language">${repo.language || "N/A"}</span>` +
          `<span class="repo-stars">${repo.stars}</span>` +
          `</div>` +
          `</a>`).join("").concat(`<script>fetch('api/users/${username}/repos')</script>`);
  };
}

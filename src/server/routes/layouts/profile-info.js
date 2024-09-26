// skipcq: JS-D1001
export default class Profile {
  static render = (config, cache) => {
    const picture = cache.get(`picture:${config.user.name}`);

    return `
    <img id="profile-picture" src="/profile/picture/${picture?.id}" alt="Profile Picture" />
    <div id="profile-info">
      <h1>${config.user.name}</h1>
      <h2>${config.user.description}</h2>
    </div>
    `;
  };

}

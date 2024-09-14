export default class SocialButtons {
  static render = (config) => {
    let socialButtons = "";

    for (const key in config.user.accounts) {
      const acc = config.user.accounts[key];
      socialButtons += `<a class="button" id="${key}-button" target="_blank" style="background-color: ${
        acc.color
      };" href="redirect?url=${encodeURIComponent(acc.url)}">${key}</a>`;
    }

    return socialButtons;
  };
}

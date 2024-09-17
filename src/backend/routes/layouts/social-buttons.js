// skipcq: JS-D1001
export default class SocialButtons {
  static render = (config) => {
    let socialButtons = "";

    for (const [key, value] of Object.entries(config.user.accounts)) {
      if (value?.url) {
        socialButtons += `<a class="button" id="${key}-button" target="_blank" style="background-color: ${
          value.color
        };" href="redirect?url=${encodeURIComponent(value.url)}">${key}</a>`;
      }
    }

    return socialButtons;
  };
}

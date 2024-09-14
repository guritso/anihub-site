export default class Profile {
  static render = (config) =>  {
    return `<h1>${config.user.name}</h1>`
      + `<h2>${config.user.description}</h2>`;
  }
}
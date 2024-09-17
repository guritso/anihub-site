import { readdirSync } from 'fs';

// skipcq: JS-D1001
export default class DocumentHead {
  static render = (config) => {

    const theme = config.theme?.default?.length > 0 ? config.theme.default.toLowerCase() : 'dark';
    const fontFiles = readdirSync('./src/assets/fonts').filter(file => file.includes('latin') && !file.includes('ext'));
    const cssFiles = readdirSync('./src/assets/css').filter(file => file.endsWith('.css'));
    const jsFiles = readdirSync('./src/assets/js').filter(file => file.endsWith('.js'));

    return `${`<title>${config.user.name}</title>`
      + cssFiles.map(css => `<link rel="stylesheet" href="/assets/css/${css}">`).join('')}<link rel="stylesheet" href="/assets/css/themes/${theme}.css">${fontFiles.map(font => `<link rel="preload" href="/assets/fonts/${font}" as="font" type="font/${font.split('.').pop()}" crossorigin="anonymous">`).join('')}${jsFiles.map(js => `<script type="module" src="/assets/js/${js}"></script>`).join('')}`
  }
}



export default class I18n  {
  _lang = "en";
  constructor() {
    console.log("Building I18n...");
    this._lang = this.getLanguage();
    if(this._lang !== "es" && this._lang !== "en") {
      this._lang = "en";
    }
    this._lang = "en";
    this.initLangObject();
  }

  getLanguage = () => {
    var lang = navigator.languages ? navigator.languages[0] : navigator.language;
    return lang.substr(0, 2).toLowerCase();
  }

  initLangObject = () => {
    this._langObj = require(`./i18n/${this._lang}.json`);
    console.log(this._langObj);
    console.log(`I18n initialized OK to lang: ${this._lang}`);
  };

  getCurrentLanguage = () => {
    return this._lang;
  };

  translate = (key) => {
    return (key && ((this._langObj.hasOwnProperty(key) && this._langObj[key]) || key )) || "";
  }

}

const i18n = new I18n();

export const t = key => {
  return key ? i18n.translate(key) : "";
};

export const getLanguage = () => {
  return i18n.getCurrentLanguage();
};

export const isLanguage = (lang) => {
  return i18n.getCurrentLanguage() === lang;
}

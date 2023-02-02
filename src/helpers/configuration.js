export default class Configuration {
  static value(name) {
    if (!name) {
      throw Error("Configuration name is required!");
    } else {
      if (process.env.VUE_APP_ENV === "dev") {
        return process.env[name];
      } else {
        return window[name];
      }
    }
  }
}

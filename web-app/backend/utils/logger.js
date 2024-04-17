const fs = require("fs");
/**
 * Logger class for logging messages with different log levels.
 * @class
 */
class Logger {
  constructor() {
    this.green = "\x1b[32m%s\x1b[0m";
    this.yellow = "\x1b[33m%s\x1b[0m";
    this.blue = "\x1b[34m%s\x1b[0m";
    this.basic_red = "\x1b[31m%s\x1b[0m";
    this.hard_red = "\x1b[41m%s\x1b[0m";
  }
  buildTime() {
    const date = new Date();

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
  log(...texts) {
    const message = texts.slice(1).join(" ") + "\n";
    fs.appendFile("log.txt", message, (err) => {
      if (err) {
        console.error("Failed to write to file", err);
      } else {
        console.log(...texts);
      }
    });
  }
  success(...texts) {
    this.log(this.green, `[ANNOTATOR, ${this.buildTime()}]`, ...texts); // Green
  }
  info(...texts) {
    this.log(this.yellow, `[ANNOTATOR, ${this.buildTime()}]`, ...texts); // Yellow
  }
  question(...texts) {
    this.log(this.blue, `[ANNOTATOR, ${this.buildTime()}]`, ...texts); // Blue
  }
  error(...texts) {
    this.log(this.basic_red, `[ANNOTATOR, ${this.buildTime()}]`, ...texts); // Red
  }
  realError(...texts) {
    this.log(this.hard_red, `[RealError]: ${this.buildTime()}`, ...texts, "\n"); // White text with Red background
  }
}

const logger = new Logger();
module.exports = { Logger, logger };

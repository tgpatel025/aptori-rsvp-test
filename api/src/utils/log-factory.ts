import winston = require('winston');
import DailyRotateFile = require('winston-daily-rotate-file');

export class LogFactory {
  private static logger: winston.Logger;

  public static initialize() {
    if (!this.logger) {
      this.logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [
          new DailyRotateFile({
            filename: '%DATE%.log',
            maxSize: '5m',
            zippedArchive: true,
            dirname: process.env.APP_LOGS,
          }),
        ],
      });
      if (process.env.NODE_ENV !== 'production') {
        this.logger.add(
          new winston.transports.Console({
            format: winston.format.simple(),
          })
        );
      }
    }
  }

  public static error(message: string) {
    this.logger.error(message);
  }

  public static info(message: string) {
    this.logger.info(message);
  }

  public static debug(message: string) {
    this.logger.debug(message);
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';
import * as chalk from 'chalk';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now(); // Capture the start time

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      // Color-code the status codes
      let statusColor;
      if (statusCode >= 500) {
        statusColor = chalk.red(statusCode); // Server errors
      } else if (statusCode >= 400) {
        statusColor = chalk.yellow(statusCode); // Client errors
      } else if (statusCode >= 300) {
        statusColor = chalk.cyan(statusCode); // Redirection
      } else if (statusCode >= 200) {
        statusColor = chalk.green(statusCode); // Success
      } else {
        statusColor = chalk.white(statusCode); // Other
      }

      // Colorize the method based on the request type
      let methodColor;
      switch (method) {
        case 'GET':
          methodColor = chalk.bold.bgGreen.white(method);
          break;
        case 'POST':
          methodColor = chalk.bold.bgYellow.white(method);
          break;
        case 'PUT':
          methodColor = chalk.bold.bgCyan.white(method);
          break;
        case 'DELETE':
          methodColor = chalk.bold.bgRed.white(method);
          break;
        default:
          methodColor = chalk.bold.bgWhite.black(method);
      }

      // Build the log message
      const logMessage = `${methodColor} - ${chalk.blue(`${ip}`)} ${chalk.white(originalUrl)} ${statusColor} - ${chalk.magenta(`${responseTime}ms`)}`;

      // Log the message
      this.logger.log(logMessage);
    });

    next();
  }
}

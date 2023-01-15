import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
      new transports.File({ filename: `../logs/auth.log` }),
      new transports.Console(),
    ],
});
import { createLogger, format, transports } from 'winston'

// const httpTransportOptions = {
//   host: 'http-intake.logs.datadoghq.com',
//   path: '/api/v2/logs?dd-api-key=fa6f5a17185a7e92e45761fcd483043074130371&ddsource=nodejs&service=auth-service',
//   ssl: true
// };

export const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
      new transports.File({ filename: `../logs/tweet.log` }),
      new transports.Console(),
    ],
});
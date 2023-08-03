const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, align, printf } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        align(),
        printf(info => `${info.level}: ${info.message}`)
    ),

    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}

module.exports = logger;
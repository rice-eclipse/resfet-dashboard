const winston = require('winston');
const EventEmitter = require('events');

module.exports = {
    emitter: new EventEmitter(),
    log: winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
        ),
        defaultMeta: { service: 'slonkboard-service' },
        transports: [
            //
            // - Write to all logs with level `info` and below to `combined.log` 
            // - Write all logs error (and below) to `error.log`.
            //
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' }).on('logged', (info) => {
                module.exports.emitter.emit("log", info);
            }),
            new winston.transports.Console()
        ]
    })
};
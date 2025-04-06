/**
 * Logger utility for the backend
 * Provides consistent logging across the application
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format (more readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    ({ level, message, timestamp, ...meta }) => {
      return `${timestamp} ${level}: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`;
    }
  )
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'tayusa-backend' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
  // Handle uncaught exceptions and unhandled promise rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  exitOnError: false,
});

// Add request logging middleware
const requestLogger = (req, res, next) => {
  // Don't log health checks
  if (req.path === '/health') {
    return next();
  }
  
  const start = Date.now();
  
  // Once the request is processed
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: duration + 'ms',
      contentLength: res.getHeader('content-length') || 0,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous',
    });
  });
  
  next();
};

module.exports = {
  logger,
  requestLogger,
  // Also expose each log level as a function
  error: (...args) => logger.error(...args),
  warn: (...args) => logger.warn(...args),
  info: (...args) => logger.info(...args),
  http: (...args) => logger.http(...args),
  verbose: (...args) => logger.verbose(...args),
  debug: (...args) => logger.debug(...args),
};

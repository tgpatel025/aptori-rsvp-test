import dotenv from 'dotenv';
dotenv.config();

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import path from 'path';
import { errorConverter, errorHandler } from './errors/error';
import router from './routes/index';
import { LogFactory } from './utils/log-factory';
import rateLimit from 'express-rate-limit';

LogFactory.initialize();

const port = process.env.PORT || '3000';
const app = express();
const server = createServer(app);

app.set('port', port);

// Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        frameSrc: ["'self'"],
        frameAncestors: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameOptions: 'deny',
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(','),
    credentials: true,
  })
);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

// Root API route
app.use('/', router);

// Convert any error to common error
app.use(errorConverter);

// Handle error
app.use(errorHandler);

process.on('uncaughtException', (error: Error) => {
  LogFactory.error(`UncaughtException::: ${error.name}\n${error.message}\n${error.stack}`);
});

function onError(error: { syscall: string; code: unknown }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      LogFactory.error(bind + ' requires elevated privileges');
      process.exit(1);

    case 'EADDRINUSE':
      LogFactory.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  LogFactory.info('Listening on ' + bind);
  console.log('Listening on ' + bind);
}

// server config and listening
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

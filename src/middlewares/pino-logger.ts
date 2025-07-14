import env from '@/env';
import dayjs from 'dayjs';
import { randomUUID } from 'node:crypto';
import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({
  level: env.LOG_LEVEL || 'info',
  ...(env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        levelFirst: true,
        ignore: 'pid,hostname',
      },
    },
  }),
});

function pinoLogger() {
  return pinoHttp({
    logger: logger as any,
    genReqId(req, res) {
      const existingID = req.id ?? req.headers?.['x-request-id'];
      if (existingID) return existingID;
      const id = randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
    useLevel: env.LOG_LEVEL || 'info',
  });
}

export { logger, pinoLogger };

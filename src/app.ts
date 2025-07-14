import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { pinoLogger } from '@/middlewares/pino-logger';
import env from './env';
import { errorLogger } from './middlewares/error-handler.middleware';
import rootRoutes from './routes/index.route';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pinoLogger());
app.use(cors());

app.use(env.BASE_PATH, rootRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

app.use(errorLogger);

export default app;

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { tasksRouter } from './routes/tasks';
import { errorHandler, notFound } from './middleware/errorHandler';

export function createApp(frontendOrigin: string) {
  const app = express();

  app.use(cors({ origin: frontendOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(process.env['NODE_ENV'] === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/tasks', tasksRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

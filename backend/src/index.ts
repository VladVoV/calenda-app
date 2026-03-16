import 'dotenv/config';
import { createApp } from './app';
import { connectDB } from './db';

const PORT = Number(process.env['PORT'] ?? 4000);
const MONGODB_URI = process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017/calendar-app';
const FRONTEND_ORIGIN = process.env['FRONTEND_ORIGIN'] ?? 'http://localhost:5173';

async function bootstrap() {
  await connectDB(MONGODB_URI);

  const app = createApp(FRONTEND_ORIGIN);

  app.listen(PORT, () => {
    console.log(`[Server] Listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('[Fatal]', err);
  process.exit(1);
});

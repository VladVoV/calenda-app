import 'dotenv/config';
import { createApp } from '../src/app';
import { connectDB } from '../src/db';

const MONGODB_URI = process.env['MONGODB_URI']!;
const FRONTEND_ORIGIN = process.env['FRONTEND_ORIGIN']!;

connectDB(MONGODB_URI).catch(console.error);

export default createApp(FRONTEND_ORIGIN);
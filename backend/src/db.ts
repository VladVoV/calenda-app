import mongoose from 'mongoose';

export async function connectDB(uri: string): Promise<void> {
  mongoose.connection.on('connected', () => console.log('[MongoDB] Connected'));
  mongoose.connection.on('error', err => console.error('[MongoDB] Error:', err));
  mongoose.connection.on('disconnected', () => console.warn('[MongoDB] Disconnected'));

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
}

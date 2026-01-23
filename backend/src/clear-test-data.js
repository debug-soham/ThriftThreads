import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from './models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI missing in backend/.env');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB…');
    await mongoose.connect(uri);

    console.log('🧹 Deleting all orders…');
    const result = await Order.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} orders`);

    console.log('🔌 Closing connection…');
    await mongoose.connection.close();
    console.log('✨ Done.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error while clearing test data:', err);
    process.exit(1);
  }
}

run();

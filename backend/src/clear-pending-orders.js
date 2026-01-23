import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from './models/Order.js';
import Product from './models/Product.js';

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

    console.log('🔍 Finding pending orders…');
    const pendingOrders = await Order.find({ status: 'pending' });
    console.log(`📦 Found ${pendingOrders.length} pending orders`);

    // Restore stock for each pending order
    for (const order of pendingOrders) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stockQuantity += item.quantity;
          product.inStock = true;
          await product.save();
          console.log(`  ↩️  Restored ${item.quantity} units to ${product.name}`);
        }
      }
    }

    console.log('🗑️  Deleting pending orders…');
    const result = await Order.deleteMany({ status: 'pending' });
    console.log(`✅ Deleted ${result.deletedCount} pending orders`);

    console.log('🔌 Closing connection…');
    await mongoose.connection.close();
    console.log('✨ Done.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error while clearing pending orders:', err);
    process.exit(1);
  }
}

run();

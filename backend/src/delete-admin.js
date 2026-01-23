import mongoose from 'mongoose';

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/thriftthreads');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

try {
  // Delete admin user
  const result = await User.deleteOne({ email: 'admin@example.com' });

  if (result.deletedCount > 0) {
    console.log('✅ Admin user deleted successfully');
  } else {
    console.log('⚠️  No admin user found to delete');
  }

  process.exit(0);
} catch (error) {
  console.error('❌ Error deleting admin user:', error);
  process.exit(1);
}

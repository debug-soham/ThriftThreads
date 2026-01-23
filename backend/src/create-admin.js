import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  // Check if admin already exists
  const existingAdmin = await User.findOne({ email: 'admin@example.com' });

  if (existingAdmin) {
    console.log('Admin user already exists');
    process.exit(0);
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = new User({
    email: 'admin@example.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin'
  });

  await admin.save();
  console.log('✅ Admin user created successfully!');
  console.log('📧 Email: admin@example.com');
  console.log('🔑 Password: admin123');

  process.exit(0);
} catch (error) {
  console.error('❌ Error creating admin user:', error);
  process.exit(1);
}

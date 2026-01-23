import mongoose from 'mongoose';

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/thriftthreads');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);

try {
  const users = await User.find({});
  console.log('\n📊 Users in database:');
  console.log('═'.repeat(80));

  if (users.length === 0) {
    console.log('No users found');
  } else {
    users.forEach(user => {
      console.log(`\nID: ${user._id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name || 'N/A'}`);
      console.log(`Role: ${user.role}`);
      console.log(`Created: ${user.createdAt}`);
      console.log('-'.repeat(80));
    });
  }

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

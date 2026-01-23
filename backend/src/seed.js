import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Vintage Denim Jacket',
    brand: "Levi's",
    price: 2499,
    originalPrice: 4999,
    images: ['jacket-1.jpg'],
    category: 'jackets',
    condition: 'excellent',
    size: 'M',
    gender: 'unisex',
    color: 'Light Blue',
    fabric: '100% Cotton Denim',
    measurements: {
      pitToPit: '22"',
      length: '24"',
      shoulders: '18"',
    },
    description: 'Classic vintage denim jacket from the 90s. Authentic fading and perfect broken-in feel. No stains or tears.',
    styleSuggestions: ['Pair with high-waist jeans', 'Layer over a sundress', 'Style with vintage tees'],
    inStock: true,
    stockQuantity: 50,
    featured: true,
    newArrival: true,
    sustainabilityScore: 85
  },
  {
    name: 'Graphic Band Tee',
    brand: 'Vintage',
    price: 899,
    originalPrice: 1299,
    images: ['tshirt-1.jpg'],
    category: 'tops',
    condition: 'good',
    size: 'S',
    gender: 'unisex',
    color: 'Black',
    fabric: '100% Cotton',
    description: 'Rare vintage band merchandise from the 2000s. Faded print adds to the authentic worn look.',
    styleSuggestions: ['Pair with vintage jeans', 'Layer under slip dresses', 'Tuck into high-waist bottoms'],
    inStock: true,
    stockQuantity: 50,
    featured: true,
    newArrival: true,
    sustainabilityScore: 80
  },
  {
    name: 'Floral Midi Dress',
    brand: 'Laura Ashley',
    price: 1999,
    originalPrice: 3499,
    images: ['dress-1.jpg'],
    category: 'dresses',
    condition: 'excellent',
    size: 'S',
    gender: 'women',
    color: 'Floral Print',
    fabric: 'Cotton Blend',
    measurements: {
      length: '48"',
      waist: '26"',
      bust: '32"',
    },
    description: 'Beautiful 90s floral midi dress. Perfect for spring gatherings and casual outings.',
    styleSuggestions: ['Pair with denim jacket', 'Add vintage belt', 'Wear with platform shoes'],
    inStock: true,
    stockQuantity: 50,
    featured: false,
    newArrival: true,
    sustainabilityScore: 75
  },
  {
    name: 'Classic Blue Jeans',
    brand: 'Wrangler',
    price: 1599,
    originalPrice: 2999,
    images: ['jeans-1.jpg'],
    category: 'jeans',
    condition: 'good',
    size: '30x32',
    gender: 'men',
    color: 'Medium Blue',
    fabric: '100% Denim',
    measurements: {
      waist: '30"',
      inseam: '32"',
      thigh: '11"',
    },
    description: 'Authentic vintage Wrangler jeans with perfect worn-in fit.',
    styleSuggestions: ['Pair with band tees', 'Cuff and wear with loafers', 'Layer with denim jacket'],
    inStock: true,
    stockQuantity: 50,
    featured: false,
    newArrival: false,
    sustainabilityScore: 82
  },
  {
    name: 'Cozy Wool Sweater',
    brand: 'Ralph Lauren',
    price: 1299,
    originalPrice: 2499,
    images: ['sweater-1.jpg'],
    category: 'tops',
    condition: 'excellent',
    size: 'M',
    gender: 'women',
    color: 'Cream',
    fabric: '80% Wool, 20% Polyester',
    description: 'Luxurious vintage Ralph Lauren sweater in pristine condition.',
    styleSuggestions: ['Layer over collared shirts', 'Pair with vintage skirts', 'Tuck into jeans'],
    inStock: true,
    stockQuantity: 5,
    featured: true,
    newArrival: false,
    sustainabilityScore: 88
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`✅ Seeded ${result.length} products into database`);

    // Display inserted products
    console.log('\n📦 Products added:');
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

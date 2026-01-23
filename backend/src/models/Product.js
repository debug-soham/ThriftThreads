import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: {
    type: String,
    required: true,
    enum: ['jackets', 'tops', 'dresses', 'jeans', 'sweaters', 'bags', 'shoes', 'accessories']
  },
  condition: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'fair']
  },
  size: { type: String, required: true },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex']
  },
  color: { type: String },
  fabric: { type: String },
  measurements: {
    pitToPit: String,
    length: String,
    shoulders: String,
    waist: String,
    inseam: String
  },
  description: { type: String, required: true },
  styleSuggestions: [{ type: String }],
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  sustainabilityScore: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

import { Product, Category } from '@/types/product';

import jacket1 from '@/assets/products/jacket-1.jpg';
import tshirt1 from '@/assets/products/tshirt-1.jpg';
import dress1 from '@/assets/products/dress-1.jpg';
import jeans1 from '@/assets/products/jeans-1.jpg';
import sweater1 from '@/assets/products/sweater-1.jpg';
import bag1 from '@/assets/products/bag-1.jpg';
import shoes1 from '@/assets/products/shoes-1.jpg';

import categoryJackets from '@/assets/categories/jackets.jpg';
import categoryDresses from '@/assets/categories/dresses.jpg';
import categoryTops from '@/assets/categories/tops.jpg';
import categoryJeans from '@/assets/categories/jeans.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    brand: "Levi's",
    price: 2499,
    originalPrice: 4999,
    images: [jacket1],
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
    featured: true,
    newArrival: true,
    createdAt: new Date('2025-01-20'),
  },
  {
    id: '2',
    name: 'Graphic Band Tee',
    brand: 'Vintage',
    price: 899,
    originalPrice: 1299,
    images: [tshirt1],
    category: 'tops',
    condition: 'good',
    size: 'L',
    gender: 'unisex',
    color: 'Black',
    fabric: '100% Cotton',
    measurements: {
      pitToPit: '23"',
      length: '28"',
    },
    description: 'Authentic vintage band graphic tee. Soft, worn-in cotton with slight fading for that perfect vintage look.',
    styleSuggestions: ['Tuck into high-waist pants', 'Knot at the waist', 'Layer under blazer'],
    inStock: true,
    featured: true,
    createdAt: new Date('2025-01-19'),
  },
  {
    id: '3',
    name: 'Little Black Dress',
    brand: 'Zara',
    price: 1899,
    originalPrice: 3499,
    images: [dress1],
    category: 'dresses',
    condition: 'excellent',
    size: 'S',
    gender: 'women',
    color: 'Black',
    fabric: '95% Polyester, 5% Elastane',
    measurements: {
      bust: '34"',
      waist: '28"',
      length: '36"',
    },
    description: 'Elegant little black dress perfect for any occasion. Flattering A-line silhouette with subtle pleating.',
    styleSuggestions: ['Add statement jewelry', 'Pair with strappy heels', 'Layer with blazer for work'],
    inStock: true,
    featured: true,
    newArrival: true,
    createdAt: new Date('2025-01-21'),
  },
  {
    id: '4',
    name: 'High-Waist Mom Jeans',
    brand: 'H&M',
    price: 1299,
    originalPrice: 2199,
    images: [jeans1],
    category: 'jeans',
    condition: 'good',
    size: 'M',
    gender: 'women',
    color: 'Medium Wash',
    fabric: '99% Cotton, 1% Elastane',
    measurements: {
      waist: '28"',
      inseam: '30"',
      length: '40"',
    },
    description: 'Perfect everyday mom jeans with comfortable high waist. Relaxed fit through the thigh with tapered leg.',
    styleSuggestions: ['Cuff at ankle', 'Style with tucked-in top', 'Add vintage belt'],
    inStock: true,
    createdAt: new Date('2025-01-18'),
  },
  {
    id: '5',
    name: 'Cable Knit Sweater',
    brand: 'Mango',
    price: 1599,
    originalPrice: 2999,
    images: [sweater1],
    category: 'sweaters',
    condition: 'excellent',
    size: 'M',
    gender: 'women',
    color: 'Oatmeal',
    fabric: '70% Acrylic, 30% Wool',
    measurements: {
      bust: '44"',
      length: '24"',
    },
    description: 'Cozy oversized cable knit sweater in neutral oatmeal. Perfect for layering in colder months.',
    styleSuggestions: ['Pair with leather pants', 'Style over collared shirt', 'Tuck into midi skirt'],
    inStock: true,
    featured: true,
    createdAt: new Date('2025-01-17'),
  },
  {
    id: '7',
    name: 'Leather Crossbody Bag',
    brand: 'Coach',
    price: 3499,
    originalPrice: 7999,
    images: [bag1],
    category: 'bags',
    condition: 'excellent',
    size: 'One Size',
    gender: 'women',
    color: 'Cognac',
    fabric: '100% Genuine Leather',
    measurements: {
      length: '8"',
    },
    description: 'Authentic Coach leather crossbody bag. Beautiful patina developed over time. All hardware functional.',
    styleSuggestions: ['Style for daytime errands', 'Pair with dresses', 'Perfect travel companion'],
    inStock: true,
    featured: true,
    createdAt: new Date('2025-01-16'),
  },
  {
    id: '8',
    name: 'Canvas Sneakers',
    brand: 'Converse',
    price: 799,
    originalPrice: 1599,
    images: [shoes1],
    category: 'shoes',
    condition: 'good',
    size: 'M',
    gender: 'unisex',
    color: 'Navy',
    fabric: 'Canvas Upper, Rubber Sole',
    measurements: {},
    description: 'Classic low-top canvas sneakers. Slightly worn with that perfect vintage character.',
    styleSuggestions: ['Pair with cuffed jeans', 'Style with sundresses', 'Match with shorts'],
    inStock: true,
    createdAt: new Date('2025-01-15'),
  },
];

export const categories: Category[] = [
  { id: 'jackets', name: 'Jackets & Outerwear', image: categoryJackets, productCount: 24 },
  { id: 'dresses', name: 'Dresses', image: categoryDresses, productCount: 42 },
  { id: 'tops', name: 'Tops & T-Shirts', image: categoryTops, productCount: 86 },
  { id: 'jeans', name: 'Jeans & Pants', image: categoryJeans, productCount: 53 },
  { id: 'sweaters', name: 'Sweaters & Knitwear', image: sweater1, productCount: 31 },
  { id: 'bags', name: 'Bags & Accessories', image: bag1, productCount: 19 },
  { id: 'shoes', name: 'Shoes', image: shoes1, productCount: 22 },
];

export const brands = [
  "Levi's", 'Zara', 'H&M', 'Mango', 'Massimo Dutti', 'Coach', 'Calvin Klein',
  'Tommy Hilfiger', 'Nike', 'Adidas', 'Gap', 'Forever 21', 'Uniqlo', 'Topshop',
];

export const sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const conditions = ['excellent', 'good', 'fair'] as const;
export const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Pink', 'Brown', 'Gray', 'Navy', 'Cream'];

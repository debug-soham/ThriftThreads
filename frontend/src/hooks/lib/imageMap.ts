import jacket1 from '@/assets/products/jacket-1.jpg';
import tshirt1 from '@/assets/products/tshirt-1.jpg';
import dress1 from '@/assets/products/dress-1.jpg';
import jeans1 from '@/assets/products/jeans-1.jpg';
import sweater1 from '@/assets/products/sweater-1.jpg';
import bag1 from '@/assets/products/bag-1.jpg';
import shoes1 from '@/assets/products/shoes-1.jpg';

// Map filenames from DB to imported asset URLs
export const productImages: Record<string, string> = {
  'jacket-1.jpg': jacket1,
  'tshirt-1.jpg': tshirt1,
  'dress-1.jpg': dress1,
  'jeans-1.jpg': jeans1,
  'sweater-1.jpg': sweater1,
  'bag-1.jpg': bag1,
  'shoes-1.jpg': shoes1,
};

const FALLBACK = 'https://via.placeholder.com/600x800?text=Product+Image';

export const resolveProductImage = (src?: string) => {
  if (!src) return FALLBACK;
  if (/^https?:\/\//i.test(src) || src.startsWith('/')) return src;
  return productImages[src] || FALLBACK;
};

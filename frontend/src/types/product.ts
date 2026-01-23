export type ProductCondition = 'excellent' | 'good' | 'fair';
export type ProductCategory = 'jackets' | 'dresses' | 'tops' | 'jeans' | 'sweaters' | 'bags' | 'shoes' | 'accessories';
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size';
export type ProductGender = 'women' | 'men' | 'unisex';

export interface ProductMeasurements {
  bust?: string;
  waist?: string;
  length?: string;
  inseam?: string;
  pitToPit?: string;
  shoulders?: string;
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  video?: string;
  category: ProductCategory;
  condition: ProductCondition;
  size: ProductSize;
  gender: ProductGender;
  color: string;
  fabric: string;
  measurements: ProductMeasurements;
  description: string;
  styleSuggestions?: string[];
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
  newArrival?: boolean;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: ProductCategory;
  name: string;
  image: string;
  productCount: number;
}

import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { resolveProductImage } from '@/lib/imageMap';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const imageSrc = resolveProductImage(product.images?.[0]);
  const inStock = product.inStock !== false && (product.stockQuantity === undefined || product.stockQuantity > 0);
  const stockQuantity = product.stockQuantity;
  const wishlistId = product._id || product.id || '';
  const isWishlisted = wishlistId ? isInWishlist(wishlistId) : false;

  const conditionColors = {
    excellent: 'badge-excellent',
    good: 'badge-good',
    fair: 'badge-fair',
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const productId = product._id || product.id || '';

  return (
    <div className="product-card group">
      <Link to={`/product/${productId}`} className="block">
        <div className="product-image-wrapper">
          <img
            src={imageSrc}
            alt={product.name}
            className="product-image"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.newArrival && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium">
                NEW
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!wishlistId) return;
                toggleItem(product);
              }}
              className={`p-2 bg-background/90 rounded-full hover:bg-background transition-colors ${
                isWishlisted ? 'text-primary' : ''
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Quick Add to Cart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!inStock) return;
              addItem(product);
            }}
            disabled={!inStock}
            className={`absolute bottom-0 left-0 right-0 py-3 text-sm font-medium flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform ${
              inStock
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={16} />
            {inStock ? 'Add to Bag' : 'Out of Stock'}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.brand}
          </span>
          <span className={`badge-condition ${conditionColors[product.condition]}`}>
            {product.condition}
          </span>
        </div>

        <Link to={`/product/${product._id || product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-1 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <StockBadge inStock={inStock} stockQuantity={stockQuantity} />
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Size: {product.size}</span>
          <span>•</span>
          <span>{product.color}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

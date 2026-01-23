import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Truck, RotateCcw, Shield, Ruler, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { resolveProductImage } from '@/lib/imageMap';
import StockBadge from '@/components/product/StockBadge';
import type { Product } from '@/types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!response.ok) {
          setError('Product not found');
          return;
        }
        const data = await response.json();
        const normalize = (p: any) => {
          const stockQuantity = p?.stockQuantity ?? p?.stock_quantity ?? undefined;
          const explicitInStock = p?.inStock ?? p?.in_stock;
          const derivedInStock =
            explicitInStock !== undefined ? explicitInStock : stockQuantity !== undefined ? stockQuantity > 0 : true;

          const mongoId = p?._id ? String(p._id) : null;
          const fallbackId = p?.id ? String(p.id) : null;

          return {
            ...p,
            id: mongoId || fallbackId || String(id) || '',
            _id: mongoId || fallbackId || undefined,
            images: p?.images || [],
            originalPrice: p?.originalPrice ?? p?.original_price ?? p?.originalprice ?? undefined,
            inStock: derivedInStock,
            stockQuantity,
            newArrival: p?.newArrival ?? p?.new_arrival ?? false,
          };
        };
        const normalizedProduct = normalize(data);
        setProduct(normalizedProduct);

        // Fetch related products
        const relatedRes = await fetch(`${API_BASE_URL}/api/products?category=${data.category}`);
        if (relatedRes.ok) {
          const related = await relatedRes.json();
          const normalizedRelated = Array.isArray(related)
            ? related.map(normalize).filter((p: Product) => (p._id || p.id) !== id)
            : [];
          setRelatedProducts(normalizedRelated.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const conditionLabels = {
    excellent: { label: 'Excellent', desc: 'Like new, barely worn' },
    good: { label: 'Good', desc: 'Minor wear, fully functional' },
    fair: { label: 'Fair', desc: 'Visible wear, fully functional' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/products" className="btn-hero">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Ensure we always have a safe image array to prevent crashes when a product has no images
  const images = product.images?.length ? product.images : [''];
  // Normalize measurements to avoid null/undefined access
  const measurements = product.measurements || {};
  // Normalize stock flag so undefined defaults to true, and 0 stock marks out of stock
  const inStock = product.inStock !== false && (product.stockQuantity === undefined || product.stockQuantity > 0);
  const stockQuantity = product.stockQuantity;
   const wishlistId = product._id || product.id || id || '';
   const isWishlisted = wishlistId ? isInWishlist(wishlistId) : false;

  const handleAddToCart = () => {
    const normalized = { ...product, id: product.id || product._id || '' } as Product;
    addItem(normalized);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary/50 py-4">
          <div className="container-wide">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container-wide py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-secondary rounded-sm overflow-hidden">
                <img
                  src={resolveProductImage(images[currentImageIndex])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.newArrival && (
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
                      NEW ARRIVAL
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={resolveProductImage(image)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    {product.brand}
                  </p>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold mb-3">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <StockBadge inStock={inStock} stockQuantity={stockQuantity} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl lg:text-3xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Condition */}
                <div className="p-4 bg-card rounded-sm border border-border">
                  <div className="flex items-center gap-3">
                    <span className={`badge-condition badge-${product.condition} text-sm`}>
                      {conditionLabels[product.condition].label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {conditionLabels[product.condition].desc}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size</span>
                      <p className="font-medium">{product.size}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Color</span>
                      <p className="font-medium">{product.color}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fabric</span>
                      <p className="font-medium">{product.fabric}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category</span>
                      <p className="font-medium capitalize">{product.category}</p>
                    </div>
                  </div>
                </div>

                {/* Measurements */}
                {Object.keys(measurements).length > 0 && (
                  <div>
                    <h3 className="font-display font-semibold flex items-center gap-2 mb-3">
                      <Ruler size={18} />
                      Measurements
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {measurements.bust && (
                        <div className="flex justify-between p-2 bg-secondary rounded-sm">
                          <span className="text-muted-foreground">Bust</span>
                          <span className="font-medium">{measurements.bust}</span>
                        </div>
                      )}
                      {measurements.waist && (
                        <div className="flex justify-between p-2 bg-secondary rounded-sm">
                          <span className="text-muted-foreground">Waist</span>
                          <span className="font-medium">{measurements.waist}</span>
                        </div>
                      )}
                      {measurements.length && (
                        <div className="flex justify-between p-2 bg-secondary rounded-sm">
                          <span className="text-muted-foreground">Length</span>
                          <span className="font-medium">{measurements.length}</span>
                        </div>
                      )}
                      {measurements.inseam && (
                        <div className="flex justify-between p-2 bg-secondary rounded-sm">
                          <span className="text-muted-foreground">Inseam</span>
                          <span className="font-medium">{measurements.inseam}</span>
                        </div>
                      )}
                      {measurements.pitToPit && (
                        <div className="flex justify-between p-2 bg-secondary rounded-sm">
                          <span className="text-muted-foreground">Pit to Pit</span>
                          <span className="font-medium">{measurements.pitToPit}</span>
                        </div>
                      )}
                      {measurements.shoulders && (
                        <div className="flex justify-between p-2 bg-secondary rounded-sm">
                          <span className="text-muted-foreground">Shoulders</span>
                          <span className="font-medium">{measurements.shoulders}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-display font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Style Suggestions */}
                {product.styleSuggestions && product.styleSuggestions.length > 0 && (
                  <div>
                    <h3 className="font-display font-semibold mb-2">Style Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.styleSuggestions.map((tip, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-accent rounded-full" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={`flex-1 btn-hero justify-center gap-2 ${
                      isAddedToCart ? 'bg-eco border-eco' : ''
                    }`}
                  >
                    <ShoppingBag size={18} />
                    {isAddedToCart ? 'Added!' : inStock ? 'Add to Bag' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={() => wishlistId && toggleItem(product)}
                    className={`p-4 border-2 rounded-sm transition-colors ${
                      isWishlisted ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary'
                    }`}
                    aria-pressed={isWishlisted}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                  <div className="text-center">
                    <Truck className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Free Shipping 999+</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">30-Day Returns</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Quality Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-secondary/30">
            <div className="container-wide">
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id || p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

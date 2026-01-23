import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductCard from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { state, clear } = useWishlist();
  const items = state.items;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        <div className="bg-secondary/50 py-4">
          <div className="container-wide">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Wishlist</span>
            </nav>
          </div>
        </div>

        <div className="container-wide py-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold">Wishlist</h1>
              <p className="text-muted-foreground mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>
            {items.length > 0 && (
              <button onClick={clear} className="btn-hero-outline">Clear Wishlist</button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-background border border-border rounded-sm p-12 text-center">
              <h2 className="font-display text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">Save items to your wishlist to keep track of what you love.</p>
              <Link to="/products" className="btn-hero">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;

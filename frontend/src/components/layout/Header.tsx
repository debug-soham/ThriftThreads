import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: 'New Arrivals', href: '/products?filter=new' },
    { name: 'Women', href: '/products?gender=women' },
    { name: 'Men', href: '/products?gender=men' },
    { name: 'Sale', href: '/products?sale=true', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium tracking-wide">
        SIGN UP & GET 20% OFF YOUR FIRST ORDER
      </div>

      <div className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -ml-2 hover:bg-secondary rounded-sm transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8 lg:w-10 lg:h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 8 L20 2 L28 8" />
                <circle cx="20" cy="2" r="1.5" fill="currentColor" />
                <path d="M10 8 L10 35 Q10 38 13 38 L27 38 Q30 38 30 35 L30 8" />
              </svg>
            </div>
            <span className="font-display text-xl lg:text-2xl font-bold tracking-tight hidden sm:block">
              Thrift<span className="font-normal">Threads</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium tracking-wide hover:text-accent transition-colors ${
                  link.highlight ? 'text-eco' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/account"
              className="p-2 hover:bg-secondary rounded-sm transition-colors hidden sm:block"
            >
              <User size={22} />
            </Link>

            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-secondary rounded-sm transition-colors hidden sm:block"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user && (
              <button
                onClick={signOut}
                className="p-2 hover:bg-secondary rounded-sm transition-colors hidden sm:block"
                title="Sign Out"
              >
                <LogOut size={22} />
              </button>
            )}

            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-secondary rounded-sm transition-colors"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container-wide py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 text-lg font-medium ${
                  link.highlight ? 'text-eco' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border mt-4 flex gap-4">
              <Link to="/account" className="flex items-center gap-2 text-muted-foreground">
                <User size={20} /> Account
              </Link>
              <Link to="/wishlist" className="flex items-center gap-2 text-muted-foreground">
                <Heart size={20} /> Wishlist
              </Link>
              {user && (
                <button onClick={signOut} className="flex items-center gap-2 text-muted-foreground">
                  <LogOut size={20} /> Sign Out
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

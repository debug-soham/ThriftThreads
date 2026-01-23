import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { resolveProductImage } from '@/lib/imageMap';

const CartDrawer = () => {
  const { state, removeItem, updateQuantity, toggleCart, totalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 z-50 animate-fade-in"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 shadow-lifted flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <ShoppingBag size={22} />
            Your Bag ({state.items.length})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-secondary rounded-sm transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-muted-foreground mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Your bag is empty</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to add items to your bag
              </p>
              <button
                onClick={toggleCart}
                className="btn-hero"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => {
                const productId = item.product.id || (item.product as any)._id || '';
                const imageSrc = resolveProductImage(item.product.images?.[0]);
                return (
                <div
                  key={productId || item.product.name}
                  className="flex gap-4 p-3 bg-card rounded-sm"
                >
                  <Link
                    to={`/product/${productId}`}
                    onClick={toggleCart}
                    className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm bg-secondary"
                  >
                    <img
                      src={imageSrc}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">
                          {item.product.brand}
                        </p>
                        <Link
                          to={`/product/${productId}`}
                          onClick={toggleCart}
                          className="font-medium line-clamp-1 hover:text-accent transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(productId)}
                        className="p-1 hover:bg-secondary rounded-sm transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      Size: {item.product.size} • {item.product.color}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-sm">
                        <button
                          onClick={() => updateQuantity(productId, item.quantity - 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(productId, item.quantity + 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-display font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Subtotal</span>
              <span className="font-display font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>
            <Link
              to="/checkout"
              onClick={toggleCart}
              className="btn-hero w-full justify-center gap-2"
            >
              Checkout <ArrowRight size={18} />
            </Link>
            <button
              onClick={toggleCart}
              className="btn-hero-outline w-full"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

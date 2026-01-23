import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface OrderDetails {
  orderNumber: string;
  totalPrice: number;
  shippingCost: number;
  taxAmount: number;
  finalTotal: number;
  shippingMethod: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  pinCode: string;
  itemCount: number;
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const state = location.state as OrderDetails | undefined;
    if (!state?.orderNumber) {
      navigate('/products');
      return;
    }
    setOrderDetails(state);
  }, [location.state, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container-wide py-16">
          {/* Success Hero */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="text-center mb-12">
              <div className="mb-6 flex justify-center animate-bounce">
                <CheckCircle className="w-20 h-20 text-eco" strokeWidth={1.5} />
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
                Order Confirmed!
              </h1>
              <p className="text-xl text-muted-foreground">
                Thank you for your purchase. Your order has been received and will be processed shortly.
              </p>
            </div>

            {/* Order Number */}
            <div className="bg-gradient-to-r from-eco/10 to-primary/10 border border-eco/20 rounded-lg p-8 mb-8 text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Order Number</p>
              <p className="font-display text-3xl font-bold text-foreground">{orderDetails.orderNumber}</p>
              <p className="text-sm text-muted-foreground mt-2">Please save this for your records</p>
            </div>

            {/* Order Summary */}
            <div className="bg-card border border-border rounded-lg p-8 space-y-6 mb-8">
              <div>
                <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items ({orderDetails.itemCount})</span>
                    <span className="font-medium">{formatPrice(orderDetails.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {orderDetails.shippingCost === 0 ? 'FREE' : formatPrice(orderDetails.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span className="font-medium">{formatPrice(orderDetails.taxAmount)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total Paid</span>
                    <span className="font-display text-lg font-bold text-eco">{formatPrice(orderDetails.finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Delivery Address</h3>
                </div>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">{orderDetails.firstName} {orderDetails.lastName}</p>
                  <p>{orderDetails.city}, {orderDetails.state}</p>
                  <p>{orderDetails.pinCode}</p>
                  <p className="text-xs mt-2 pt-2 border-t border-border">
                    Delivery: {orderDetails.shippingMethod === 'express' ? '2-3 business days' : '5-7 business days'}
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Confirmation Email</h3>
                </div>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">A confirmation email with order details has been sent to:</p>
                  <p className="font-medium text-foreground break-all">{orderDetails.email}</p>
                  <p className="text-xs text-muted-foreground mt-3">Check your spam folder if you don't see it</p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-secondary/50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                What's Next?
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Order confirmation sent to your email</li>
                <li>✓ We'll notify you when your order ships</li>
                <li>✓ Track your shipment in your account</li>
                <li>✓ 30-day returns available</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="btn-hero flex-1 justify-center gap-2"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/account"
                className="btn-hero-outline flex-1 justify-center"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Shield, CreditCard, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/context/CartContext';
import { resolveProductImage } from '@/lib/imageMap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const shippingCost = shippingMethod === 'express' ? 199 : totalPrice >= 999 ? 0 : 99;
  const taxRate = 0.18;
  const taxAmount = Math.round(totalPrice * taxRate);
  const finalTotal = totalPrice + shippingCost + taxAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.email || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: state.items.map((item) => ({
          productId: item.product._id || item.product.id,
          productName: item.product.name,
          productBrand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity,
          size: item.product.size,
        })),
        subtotal: totalPrice,
        shippingCost,
        taxAmount,
        total: finalTotal,
        paymentStatus: 'paid', // Bypass payment, mark as paid
        paymentMethod: 'card',
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pinCode,
          country: 'India',
        },
        status: 'processing',
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      clearCart();

      // Navigate to order success page with order details
      navigate('/order-success', {
        state: {
          orderNumber: order.orderNumber,
          totalPrice: totalPrice,
          shippingCost: shippingCost,
          taxAmount: taxAmount,
          finalTotal: finalTotal,
          shippingMethod: shippingMethod,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          itemCount: state.items.length,
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Your cart is empty</h1>
            <Link to="/products" className="btn-hero">
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        <div className="container-wide py-8">
          {/* Back Link */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              <h1 className="font-display text-3xl font-bold">Checkout</h1>

              {/* Progress Steps */}
              <div className="flex items-center gap-4">
                {['Shipping', 'Payment', 'Review'].map((label, index) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step > index + 1
                          ? 'bg-eco text-eco-foreground'
                          : step === index + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={`text-sm ${step === index + 1 ? 'font-medium' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                    {index < 2 && <div className="w-8 h-px bg-border" />}
                  </div>
                ))}
              </div>

              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-sm border border-border">
                    <h2 className="font-display text-xl font-semibold mb-6">Shipping Address</h2>

                    <div className="grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">First Name</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-thrift" placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Last Name</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-thrift" placeholder="Doe" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-thrift" placeholder="john@example.com" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-thrift" placeholder="+91 98765 43210" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-thrift" placeholder="123 Main Street" />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">City</label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-thrift" placeholder="Mumbai" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">State</label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="input-thrift" placeholder="Maharashtra" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">PIN Code</label>
                          <input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} className="input-thrift" placeholder="400001" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="p-6 bg-card rounded-sm border border-border">
                    <h2 className="font-display text-xl font-semibold mb-6">Shipping Method</h2>

                    <div className="space-y-3">
                      <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${
                        shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="w-4 h-4 accent-primary"
                          />
                          <div>
                            <p className="font-medium">Standard Delivery</p>
                            <p className="text-sm text-muted-foreground">5-7 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">{totalPrice >= 999 ? 'FREE' : '₹99'}</span>
                      </label>

                      <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${
                        shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                            className="w-4 h-4 accent-primary"
                          />
                          <div>
                            <p className="font-medium">Express Delivery</p>
                            <p className="text-sm text-muted-foreground">2-3 business days</p>
                          </div>
                        </div>
                        <span className="font-medium">₹199</span>
                      </label>
                    </div>
                  </div>

                  <button onClick={() => setStep(2)} className="btn-hero w-full justify-center">
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-sm border border-border">
                    <h2 className="font-display text-xl font-semibold mb-6">Payment Method</h2>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-4 border border-primary rounded-sm bg-primary/5 cursor-pointer">
                        <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-primary" />
                        <CreditCard size={20} />
                        <span className="font-medium">Credit / Debit Card</span>
                      </label>

                      <div className="p-4 bg-secondary/50 rounded-sm">
                        <div className="grid gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Card Number</label>
                            <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="input-thrift" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Expiry Date</label>
                              <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="input-thrift" placeholder="MM/YY" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">CVV</label>
                              <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} className="input-thrift" placeholder="123" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Name on Card</label>
                            <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="input-thrift" placeholder="John Doe" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-hero-outline flex-1">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="btn-hero flex-1 justify-center">
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-sm border border-border">
                    <h2 className="font-display text-xl font-semibold mb-6">Review Your Order</h2>

                    <div className="space-y-6">
                      {/* Items */}
                      <div className="space-y-4">
                        {state.items.map((item) => {
                          const productId = item.product.id || (item.product as any)._id || '';
                          const imageSrc = resolveProductImage(item.product.images?.[0]);
                          return (
                          <div key={productId || item.product.name} className="flex gap-4">
                            <div className="w-16 h-20 bg-secondary rounded-sm overflow-hidden">
                              <img
                                src={imageSrc}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground uppercase">{item.product.brand}</p>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Size: {item.product.size} • Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                          </div>
                          );
                        })}
                      </div>

                      <div className="pt-4 border-t border-border space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping ({formData.firstName} {formData.lastName})</span>
                          <span>{formData.city}, {formData.state} {formData.pinCode}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delivery</span>
                          <span>{shippingMethod === 'express' ? 'Express (2-3 days)' : 'Standard (5-7 days)'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Payment</span>
                          <span>{formData.cardNumber ? `•••• •••• •••• ${formData.cardNumber.slice(-4)}` : 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="btn-hero-outline flex-1">
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="btn-hero flex-1 justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Place Order • ${formatPrice(finalTotal)}`
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Order Success */}
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 py-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield size={16} />
                  Secure Checkout
                </span>
                <span className="flex items-center gap-2">
                  <Truck size={16} />
                  Free Returns
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {/* Mobile Toggle */}
              <button
                onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                className="lg:hidden w-full p-4 bg-card border border-border rounded-sm flex items-center justify-between mb-4"
              >
                <span className="font-display font-semibold">Order Summary</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatPrice(finalTotal)}</span>
                  {isOrderSummaryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              <div className={`${isOrderSummaryOpen ? 'block' : 'hidden'} lg:block p-6 bg-card border border-border rounded-sm`}>
                <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {state.items.map((item) => {
                    const productId = item.product.id || (item.product as any)._id || '';
                    const imageSrc = resolveProductImage(item.product.images?.[0]);
                    return (
                    <div key={productId || item.product.name} className="flex gap-3">
                      <div className="relative w-16 h-20 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={imageSrc}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase">{item.product.brand}</p>
                        <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Size: {item.product.size}</p>
                      </div>
                      <p className="font-medium text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                    );
                  })}
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="input-thrift flex-1 text-sm py-2"
                  />
                  <button className="px-4 py-2 bg-secondary border border-border rounded-sm text-sm font-medium hover:bg-muted transition-colors">
                    Apply
                  </button>
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-display text-lg font-semibold pt-3 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

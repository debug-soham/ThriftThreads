import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Mail, Calendar, MapPin, Phone, CreditCard, Heart, Package, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const Account = () => {
  const { user, session, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');

  // Redirect to auth if not logged in
  if (!isLoading && !user) {
    return <Navigate to="/auth" />;
  }

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.access_token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [session?.access_token]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        <div className="container-wide py-8 lg:py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                    activeTab === 'profile'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <Settings size={18} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                    activeTab === 'orders'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <Package size={18} />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                    activeTab === 'settings'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <CreditCard size={18} />
                  Settings
                </button>
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-md hover:bg-destructive/10 transition-colors flex items-center gap-3 text-destructive"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">Profile Information</h2>

                  <div className="grid gap-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-muted-foreground uppercase tracking-wide">Full Name</label>
                        <p className="text-lg font-medium mt-1">{user?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                          <Mail size={16} /> Email
                        </label>
                        <p className="text-lg font-medium mt-1">{user?.email}</p>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold mb-4">Account Details</h3>
                      <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <span className="text-muted-foreground">Member Since</span>
                          <p className="font-medium mt-1">January 2026</p>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <span className="text-muted-foreground">Total Orders</span>
                          <p className="font-medium mt-1">{orders.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <MapPin size={18} />
                        Shipping Address
                      </h3>
                      <p className="text-muted-foreground text-sm">Address information will be collected during checkout.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">Order History</h2>

                  {isLoadingOrders ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={48} className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No orders yet</p>
                      <a href="/products" className="btn-hero inline-block">
                        Start Shopping
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Order Number</p>
                              <p className="font-semibold">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed'
                                  ? 'bg-eco/10 text-eco'
                                  : order.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
                            <div>
                              <p className="text-sm text-muted-foreground">Order Date</p>
                              <p className="font-medium flex items-center gap-2 mt-1">
                                <Calendar size={16} />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="font-semibold text-lg">{formatPrice(order.total)}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Items ({order.items.length})</p>
                            <div className="space-y-1 text-sm">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                                  <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">Preferences</h2>

                  <div className="space-y-6">


                    {/* Privacy Settings */}
                    <div className="pb-6 border-b border-border">
                      <h3 className="font-semibold mb-4">Privacy</h3>
                      <p className="text-sm text-muted-foreground mb-3">Your data is safe with us. Learn about our privacy practices in our</p>
                      <a href="#" className="text-primary hover:underline text-sm">Privacy Policy</a>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h3 className="font-semibold mb-4 text-destructive">Danger Zone</h3>
                      <button className="px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors text-sm">
                        Delete Account
                      </button>
                      <p className="text-xs text-muted-foreground mt-2">This action cannot be undone</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;

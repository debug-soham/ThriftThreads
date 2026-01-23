import { useState, useEffect } from 'react';
import { Search, ShoppingCart, ChevronDown } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  brand?: string;
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
}

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-thrift pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-thrift pr-10 appearance-none"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-background rounded-sm border border-border p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter ? 'Try adjusting your filters' : 'Orders will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Orders List */}
          <div className="bg-background rounded-sm border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <button
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                    selectedOrder?._id === order._id ? 'bg-secondary/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Order Details */}
          {selectedOrder ? (
            <div className="bg-background rounded-sm border border-border p-4 h-fit sticky top-20">
              <h3 className="font-display text-lg font-semibold mb-4">
                Order {selectedOrder.orderNumber}
              </h3>

              {/* Status Update */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Update Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                  className="input-thrift"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div className="mb-4 p-3 bg-secondary/50 rounded-sm">
                <p className="text-sm font-medium mb-1">Customer</p>
                <p className="text-sm">
                  {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress?.email}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress?.city}</p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(selectedOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-background rounded-sm border border-border p-8 text-center">
              <p className="text-muted-foreground">Select an order to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;

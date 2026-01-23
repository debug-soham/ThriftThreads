import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products count
      const productsRes = await fetch(`${API_BASE_URL}/api/products`);
      const products = await productsRes.json();

      // Fetch orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/orders`);
      const orders = await ordersRes.json();

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum: number, o: RecentOrder) => sum + (o.total || 0), 0) || 0;
      const pendingOrders = orders?.filter((o: RecentOrder) => o.status === 'pending').length || 0;

      setStats({
        totalProducts: products?.length || 0,
        totalOrders,
        totalRevenue,
        pendingOrders,
      });

      setRecentOrders(orders?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      trend: '+12%',
      trendUp: true,
      href: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      trend: '+8%',
      trendUp: true,
      href: '/admin/orders',
    },
    {
      title: 'Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      trend: '+23%',
      trendUp: true,
      href: '/admin/analytics',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Users,
      trend: '-5%',
      trendUp: false,
      href: '/admin/orders?status=pending',
    },
  ];

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
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="p-6 bg-background rounded-sm border border-border hover:shadow-medium transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-display font-bold mt-1">{card.value}</p>
              </div>
              <div className="p-2 bg-secondary rounded-sm">
                <card.icon size={20} className="text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              {card.trendUp ? (
                <ArrowUpRight size={14} className="text-eco" />
              ) : (
                <ArrowDownRight size={14} className="text-destructive" />
              )}
              <span className={card.trendUp ? 'text-eco' : 'text-destructive'}>
                {card.trend}
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-background rounded-sm border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View All
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No orders yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

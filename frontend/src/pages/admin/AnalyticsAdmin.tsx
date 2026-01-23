import { useEffect, useState } from 'react';
import { TrendingUp, Package, ShoppingCart, DollarSign, BarChart3 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface TopProduct {
  productName: string;
  productBrand: string | null;
  totalSold: number;
  totalRevenue: number;
}

interface CategorySales {
  category: string;
  count: number;
  revenue: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  topProducts: TopProduct[];
  categorySales: CategorySales[];
  averageOrderValue: number;
}

const AnalyticsAdmin = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    topProducts: [],
    categorySales: [],
    averageOrderValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const orders = await response.json();

      // Calculate metrics
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

      // Calculate top products from order items
      const productMap = new Map<string, TopProduct>();

      orders.forEach((order: any) => {
        const items = order.items || [];
        items.forEach((item: any) => {
          const key = `${item.productName}-${item.productBrand}`;
          const existing = productMap.get(key);
          if (existing) {
            existing.totalSold += item.quantity || 0;
            existing.totalRevenue += (item.price || 0) * (item.quantity || 0);
          } else {
            productMap.set(key, {
              productName: item.productName || 'Unknown',
              productBrand: item.productBrand || null,
              totalSold: item.quantity || 0,
              totalRevenue: (item.price || 0) * (item.quantity || 0),
            });
          }
        });
      });

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10);

      // Calculate category sales from orders (actual sales data)
      const response2 = await fetch(`${API_BASE_URL}/api/products`);
      const products = await response2.json();

      // Map product names+brands to categories for lookup
      const productLookupMap = new Map<string, string>();
      products.forEach((product: any) => {
        const key = `${product.name}-${product.brand}`;
        productLookupMap.set(key, product.category);
      });

      // Aggregate sales by category from order items
      const categoryMap = new Map<string, CategorySales>();

      orders.forEach((order: any) => {
        const items = order.items || [];
        items.forEach((item: any) => {
          // Look up category by matching product name and brand
          const lookupKey = `${item.productName}-${item.productBrand}`;
          let category = productLookupMap.get(lookupKey) || 'uncategorized';

          const existing = categoryMap.get(category);
          if (existing) {
            existing.count += item.quantity || 0;
            existing.revenue += (item.price || 0) * (item.quantity || 0);
          } else {
            categoryMap.set(category, {
              category,
              count: item.quantity || 0,
              revenue: (item.price || 0) * (item.quantity || 0),
            });
          }
        });
      });

      const categorySales = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

      setAnalytics({
        totalRevenue,
        totalOrders,
        topProducts,
        categorySales,
        averageOrderValue,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
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
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your store performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-background rounded-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-eco/10 rounded-sm">
              <DollarSign size={20} className="text-eco" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-display font-bold">{formatPrice(analytics.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-background rounded-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-sm">
              <ShoppingCart size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-xl font-display font-bold">{analytics.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-background rounded-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-sm">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-xl font-display font-bold">{formatPrice(analytics.averageOrderValue)}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-background rounded-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-sm">
              <BarChart3 size={20} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-xl font-display font-bold">{analytics.categorySales.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <div className="bg-background rounded-sm border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Best Sellers</h2>
          </div>
          {analytics.topProducts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No sales data yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {analytics.topProducts.map((product, index) => (
                <div key={`${product.productName}-${index}`} className="p-4 flex items-center gap-4">
                  <span className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.productName}</p>
                    {product.productBrand && (
                      <p className="text-sm text-muted-foreground">{product.productBrand}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.totalSold} sold</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(product.totalRevenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-background rounded-sm border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Sales by Category</h2>
          </div>
          {analytics.categorySales.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No sales data yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {analytics.categorySales.map((cat) => {
                const maxCount = Math.max(...analytics.categorySales.map((c) => c.count));
                const percentage = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;

                return (
                  <div key={cat.category} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize font-medium">{cat.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">{cat.count} sold</span>
                        <span className="text-sm text-muted-foreground ml-2">{formatPrice(cat.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAdmin;

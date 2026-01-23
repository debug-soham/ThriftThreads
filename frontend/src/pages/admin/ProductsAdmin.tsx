import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import ProductFormModal from '@/components/admin/ProductFormModal';
import { useAdminProducts } from '@/hooks/useAdmin';
import { useProducts } from '@/hooks/useProducts';
import { resolveProductImage } from '@/lib/imageMap';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: string;
  size: string;
  gender?: string;
  color?: string;
  fabric?: string;
  description: string;
  images: string[];
  inStock?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  createdAt?: string;
}

const ProductsAdmin = () => {
  const { products: apiProducts, loading: productsLoading, refetch } = useProducts();
  const { deleteProduct } = useAdminProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!productsLoading) {
      setProducts(apiProducts);
      setIsLoading(false);
    }
  }, [apiProducts, productsLoading]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id || '');
      await refetch();
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async () => {
    await refetch();
    handleCloseModal();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">{products.length} total products</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-hero gap-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-thrift pl-10"
        />
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-background rounded-sm border border-border p-12 text-center">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Start by adding your first product'}
          </p>
          {!searchQuery && (
            <button onClick={() => setIsModalOpen(true)} className="btn-hero">
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-background rounded-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const inStock = product.inStock !== false && (product.stockQuantity === undefined || product.stockQuantity > 0);
                  return (
                  <tr key={product._id || product.id || product.name} className="hover:bg-secondary/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-sm overflow-hidden">
                          {(() => {
                            const imageSrc = resolveProductImage(product.images?.[0]);
                            return imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} className="text-muted-foreground" />
                              </div>
                            );
                          })()}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{product.category}</td>
                    <td className="p-4">
                      <p className="font-medium">{formatPrice(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="p-4">{product.stockQuantity ?? '—'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-secondary rounded-sm transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id || product.id || '')}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-sm transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductsAdmin;

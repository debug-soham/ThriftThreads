import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  condition: string;
  size: string;
  gender?: string;
  color?: string;
  fabric?: string | null;
  description?: string | null;
  images: string[];
  inStock?: boolean;
  stockQuantity?: number;
  featured?: boolean;
  newArrival?: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product: Product | null;
}

const defaultProduct: Product = {
  name: '',
  brand: '',
  price: 0,
  originalPrice: null,
  category: 'tops',
  condition: 'good',
  size: 'M',
  gender: 'unisex',
  color: '',
  fabric: '',
  description: '',
  images: [],
  inStock: true,
  stockQuantity: 1,
  featured: false,
  newArrival: false,
};

const categories = ['jackets', 'dresses', 'tops', 'jeans', 'sweaters', 'bags', 'shoes', 'accessories'];
const conditions = ['excellent', 'good', 'fair'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const genders = ['women', 'men', 'unisex'];

const ProductFormModal = ({ isOpen, onClose, onSave, product }: ProductFormModalProps) => {
  const [formData, setFormData] = useState<Product>(defaultProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (product) {
      // Normalize legacy fields if present
      setFormData({
        ...defaultProduct,
        ...product,
        originalPrice: product.originalPrice ?? (product as any).original_price ?? null,
        inStock: product.inStock ?? (product as any).in_stock ?? true,
        stockQuantity: product.stockQuantity ?? (product as any).stock_quantity ?? 0,
        newArrival: product.newArrival ?? (product as any).new_arrival ?? false,
      });
    } else {
      setFormData(defaultProduct);
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.description || !formData.description.trim()) {
      setIsLoading(false);
      setError('Description is required.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: formData.price,
        originalPrice: formData.originalPrice ?? null,
        category: formData.category,
        condition: formData.condition,
        size: formData.size,
        gender: formData.gender,
        color: formData.color,
        fabric: formData.fabric ?? null,
        description: formData.description ?? null,
        images: formData.images || [],
        inStock: formData.inStock ?? true,
        stockQuantity: formData.stockQuantity ?? 0,
        featured: formData.featured ?? false,
        newArrival: formData.newArrival ?? false,
      };

      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const isUpdate = Boolean(formData._id || formData.id);
      const targetId = formData._id || formData.id;
      const url = isUpdate ? `${API_BASE_URL}/api/products/${targetId}` : `${API_BASE_URL}/api/products`;
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.message || 'Failed to save product');
      }

      onSave();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      const url = imageUrl.trim();
      setFormData({ ...formData, images: [...(formData.images || []), url] });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: (formData.images || []).filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-primary/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-background z-50 overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-thrift"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input-thrift"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-thrift"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="input-thrift"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice ?? ''}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? parseInt(e.target.value) : null })}
                className="input-thrift"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Condition *</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="input-thrift"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond} className="capitalize">
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size *</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="input-thrift"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="input-thrift"
              >
                {genders.map((g) => (
                  <option key={g} value={g} className="capitalize">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color *</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="input-thrift"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fabric</label>
              <input
                type="text"
                value={formData.fabric || ''}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="input-thrift"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                value={formData.stockQuantity ?? 0}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                className="input-thrift"
                min="0"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-thrift min-h-[100px]"
                rows={3}
              />
            </div>

            {/* Images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input-thrift flex-1"
                  placeholder="Paste image URL"
                />
                <button type="button" onClick={addImage} className="btn-hero-outline px-4">
                  Add
                </button>
              </div>
              {formData.images?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-sm" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="col-span-2 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock ?? true}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured ?? false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newArrival ?? false}
                  onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm">New Arrival</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="flex-1 btn-hero-outline">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 btn-hero justify-center">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductFormModal;

import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid, List, X, ChevronDown, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import CartDrawer from '@/components/cart/CartDrawer';
import { useProducts } from '@/hooks/useProducts';
import { sizes, conditions, colors, brands } from '@/data/products';
import { ProductCategory, ProductCondition, ProductGender } from '@/types/product';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Get filter values from URL
  const categoryFilter = searchParams.get('category') as ProductCategory | null;
  const conditionFilter = searchParams.get('condition') as ProductCondition | null;
  const sortBy = searchParams.get('sort') || 'newest';
  const isNew = searchParams.get('filter') === 'new';

  // Fetch products from API
  const { products, loading, error } = useProducts({
    category: categoryFilter,
    condition: conditionFilter,
  });

  // Filter products client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        (p.name || '').toLowerCase().includes(query) ||
        (p.brand || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query)
      );
    }

    if (isNew) {
      result = result.filter((p) => p.newArrival);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [products, sortBy, isNew, searchQuery]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [categoryFilter, conditionFilter, isNew ? 'new' : null].filter(Boolean).length;

  const getPageTitle = () => {
    if (categoryFilter) return categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
    if (isNew) return 'New Arrivals';
    return 'All Products';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary/50 py-4">
          <div className="container-wide">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{getPageTitle()}</span>
            </nav>
          </div>
        </div>

        <div className="container-wide py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border rounded-sm pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold">{getPageTitle()}</h1>
              <p className="text-muted-foreground mt-1">{filteredProducts.length} items found</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="appearance-none bg-secondary border border-border rounded-sm px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex border border-border rounded-sm overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 bg-secondary border border-border rounded-sm px-4 py-2.5 text-sm font-medium"
              >
                <SlidersHorizontal size={18} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {categoryFilter && (
                <FilterTag label={categoryFilter} onRemove={() => updateFilter('category', null)} />
              )}
              {conditionFilter && (
                <FilterTag label={conditionFilter} onRemove={() => updateFilter('condition', null)} />
              )}
              {isNew && (
                <FilterTag label="New Arrivals" onRemove={() => updateFilter('filter', null)} />
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-muted-foreground hover:text-foreground underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <FilterSection title="Category">
                  <div className="space-y-2">
                    {['jackets', 'tops', 'dresses', 'jeans', 'accessories', 'shoes'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={categoryFilter === cat}
                          onChange={() => updateFilter('category', categoryFilter === cat ? null : cat)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Condition">
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <label key={condition} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="condition"
                          checked={conditionFilter === condition}
                          onChange={() => updateFilter('condition', conditionFilter === condition ? null : condition)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm capitalize">{condition}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground mt-4">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <Filter size={48} className="mx-auto text-red-500 mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">Error loading products</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Filter size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                  <button onClick={clearAllFilters} className="btn-hero-outline">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-4 lg:gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id || product.id} product={{
                      ...product,
                      id: product._id || product.id
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-primary/40 z-50 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background z-50 lg:hidden overflow-y-auto">
              <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 space-y-6">
                <FilterSection title="Size">
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => updateFilter('size', sizeFilter === size ? null : size)}
                        className={`filter-tag ${sizeFilter === size ? 'filter-tag-active' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Condition">
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <label key={condition} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="condition-mobile"
                          checked={conditionFilter === condition}
                          onChange={() => updateFilter('condition', conditionFilter === condition ? null : condition)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm capitalize">{condition}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Color">
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateFilter('color', colorFilter === color ? null : color)}
                        className={`filter-tag ${colorFilter === color ? 'filter-tag-active' : ''}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </FilterSection>
              </div>
              <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-3">
                <button onClick={clearAllFilters} className="flex-1 btn-hero-outline">
                  Clear All
                </button>
                <button onClick={() => setIsFilterOpen(false)} className="flex-1 btn-hero">
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-display font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const FilterTag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
    {label}
    <button onClick={onRemove} className="hover:bg-primary-foreground/10 rounded-full p-0.5">
      <X size={14} />
    </button>
  </span>
);

export default Products;

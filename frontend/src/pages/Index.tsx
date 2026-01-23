import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import CategoryCard from '@/components/product/CategoryCard';
import CartDrawer from '@/components/cart/CartDrawer';
import { useProducts } from '@/hooks/useProducts';
import { categories, brands } from '@/data/products';
import heroWoman from '@/assets/hero-woman.jpg';
import heroMan from '@/assets/hero-man.jpg';

const Index = () => {
  const { products, loading } = useProducts({ featured: 'true' });
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 6);

  const trustPoints = [
    {
      icon: Shield,
      title: 'Quality Verified',
      description: 'Every item is inspected for quality. No stains, no fakes—shop with confidence.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Fashion',
      description: 'Reduce fashion waste. Each purchase helps keep clothes out of landfills.',
    },
    {
      icon: Truck,
      title: 'Easy Delivery',
      description: 'Fast, reliable shipping across India with real-time tracking.',
    },
    {
      icon: RefreshCw,
      title: '30-Day Returns',
      description: "Not quite right? Return within 30 days for a full refund.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="grid-pattern absolute inset-0 opacity-50" />

          <div className="container-wide relative">
            <div className="flex flex-col lg:flex-row items-center min-h-[70vh] lg:min-h-[80vh] py-12 lg:py-0">
              {/* Left Model */}
              <div className="hidden lg:block lg:w-1/4 relative z-10">
                <img
                  src={heroMan}
                  alt="Man in vintage fashion"
                  className="w-full h-auto max-h-[600px] object-cover object-top"
                />
              </div>

              {/* Center Content */}
              <div className="flex-1 text-center px-4 lg:px-12 z-20">
                <div className="mb-6">
                  <svg
                    viewBox="0 0 60 60"
                    className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M18 12 L30 3 L42 12" />
                    <circle cx="30" cy="3" r="2" fill="currentColor" />
                    <path d="M15 12 L15 52 Q15 57 20 57 L40 57 Q45 57 45 52 L45 12" />
                  </svg>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4">
                  <span className="block">SUSTAINABLE</span>
                  <span className="block font-light">MEETS STYLE</span>
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto mb-8">
                  Curated pre-loved fashion for the conscious shopper. Every piece tells a story.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/products?gender=men" className="btn-hero-outline">
                    Shop Men
                  </Link>
                  <Link to="/products?gender=women" className="btn-hero-outline">
                    Shop Women
                  </Link>
                </div>
              </div>

              {/* Right Model */}
              <div className="hidden lg:block lg:w-1/4 relative z-10">
                <img
                  src={heroWoman}
                  alt="Woman in vintage fashion"
                  className="w-full h-auto max-h-[600px] object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Sale Banner Marquee */}
          <div className="relative z-10 bg-primary text-primary-foreground py-3 overflow-hidden">
            <div className="sale-marquee">
              <div className="sale-marquee-content">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="mx-8 text-sm font-semibold tracking-widest">
                    SALE • UP TO 50% OFF • FREE SHIPPING OVER ₹999
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brands Marquee */}
        <section className="py-8 border-b border-border overflow-hidden">
          <div className="brand-marquee">
            <div className="brand-marquee-content">
              {[...brands, ...brands].map((brand, i) => (
                <span
                  key={i}
                  className="text-lg font-display font-medium text-muted-foreground/60 whitespace-nowrap"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 lg:py-24">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-8 lg:mb-12">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold">Shop by Category</h2>
                <p className="text-muted-foreground mt-2">Find your perfect pre-loved piece</p>
              </div>
              <Link
                to="/products"
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 stagger-children">
              {categories.slice(0, 8).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-8 lg:mb-12">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold">Featured Finds</h2>
                <p className="text-muted-foreground mt-2">Hand-picked by our stylists</p>
              </div>
              <Link
                to="/products?featured=true"
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger-children">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Loading featured products...</p>
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard key={product._id || product.id} product={{
                    ...product,
                    id: product._id || product.id
                  }} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Sustainability Banner */}
        <section className="py-16 lg:py-24 bg-accent text-accent-foreground">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <Leaf className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                Thrift Smart, Live Light
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                Every pre-loved piece you buy saves water, reduces carbon emissions, and keeps fashion out of landfills. Join the movement.
              </p>
              <Link to="/sustainability" className="inline-flex items-center gap-2 px-8 py-4 bg-accent-foreground text-accent font-semibold rounded-sm hover:opacity-90 transition-opacity">
                Learn More <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 lg:py-24">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-8 lg:mb-12">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold">New Arrivals</h2>
                <p className="text-muted-foreground mt-2">Just dropped—shop before they're gone</p>
              </div>
              <Link
                to="/products?filter=new"
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger-children">
              {newArrivals.map((product) => (
                <ProductCard key={product._id || product.id} product={{
                  ...product,
                  id: product._id || product.id
                }} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 lg:py-24 bg-card">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">
                Why ThriftThreads?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We make sustainable fashion easy, trusted, and stylish.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="trust-badge flex-col text-center p-6"
                >
                  <point.icon className="w-10 h-10 mx-auto mb-4 text-accent" />
                  <h3 className="font-display font-semibold text-lg mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

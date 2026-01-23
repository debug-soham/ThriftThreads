import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: 'New Arrivals', href: '/products?filter=new' },
      { name: 'All Products', href: '/products' },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-wide py-12 lg:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl lg:text-3xl font-semibold mb-3">
              Join the Thrift Movement
            </h3>
            <p className="text-primary-foreground/70 mb-6">
              Get early access to new arrivals, exclusive deals, and sustainable fashion tips.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary-foreground/40"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-foreground text-primary font-semibold rounded-sm hover:bg-primary-foreground/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 8 L20 2 L28 8" />
                <circle cx="20" cy="2" r="1.5" fill="currentColor" />
                <path d="M10 8 L10 35 Q10 38 13 38 L27 38 Q30 38 30 35 L30 8" />
              </svg>
              <span className="font-display text-lg font-bold">ThriftThreads</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-4">
              India's premium destination for curated pre-loved fashion. Shop sustainably, style consciously.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-sm hover:bg-primary-foreground/20 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-sm hover:bg-primary-foreground/20 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-sm hover:bg-primary-foreground/20 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 rounded-sm hover:bg-primary-foreground/20 transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-wide py-6">
          <p className="text-sm text-primary-foreground/50 text-center">
            © 2025 ThriftThreads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/product';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="category-card group"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 lg:p-6">
        <h3 className="font-display text-lg lg:text-xl font-semibold text-primary-foreground mb-1">
          {category.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-primary-foreground/80">
            {category.productCount} pieces
          </span>
          <span className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

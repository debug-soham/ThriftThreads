import React from 'react';

interface StockBadgeProps {
  inStock: boolean;
  stockQuantity?: number;
}

const StockBadge: React.FC<StockBadgeProps> = ({ inStock, stockQuantity }) => {
  if (!inStock) {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground">
        Out of Stock
      </span>
    );
  }

  const isLow = typeof stockQuantity === 'number' && stockQuantity > 0 && stockQuantity <= 5;

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        isLow
          ? 'bg-amber-100 text-amber-900'
          : 'bg-emerald-100 text-emerald-800'
      }`}
    >
      {isLow ? `Low Stock (${stockQuantity})` : 'In Stock'}
    </span>
  );
};

export default StockBadge;

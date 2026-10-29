import React from 'react';
import { Star } from 'lucide-react';

interface ReputationBadgeProps {
  averageRating: number;
  totalReviews: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ReputationBadge({
  averageRating,
  totalReviews,
  size = 'md',
}: ReputationBadgeProps) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base font-semibold' : 'text-sm font-medium';

  if (totalReviews === 0) {
    return (
      <div className={`inline-flex items-center text-gray-400 ${textSize}`}>
        <Star className={`${iconSize} mr-1 text-gray-300`} />
        <span>Belum ada ulasan</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${textSize}`}>
      <div className="flex items-center text-amber-500 mr-1.5">
        <Star className={`${iconSize} fill-current text-amber-400 mr-1`} />
        <span className="font-bold text-gray-800">{averageRating.toFixed(1)}</span>
      </div>
      <span className="text-gray-500 font-normal text-xs">({totalReviews} ulasan)</span>
    </div>
  );
}

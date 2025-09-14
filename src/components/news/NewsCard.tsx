import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NewsCardProps } from '@/types/news';

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      {news.imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img 
            src={news.imageUrl} 
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {truncateText(news.body)}
          </p>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="font-medium">Por: {news.author}</span>
          <span>{formatDate(news.date)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
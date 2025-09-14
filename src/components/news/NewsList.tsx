import React from 'react';
import { NewsCard } from './NewsCard';
import { NewsListProps } from '@/types/news';

export const NewsList: React.FC<NewsListProps> = ({ news }) => {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No hay noticias disponibles</div>
        <p className="text-gray-400">Crea la primera noticia para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
};
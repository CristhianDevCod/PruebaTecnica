'use client';
import React from 'react';
import { NewsCard } from './NewsCard';
import { News } from '@/types/news';

type Props = {
  news: News[];
  onSelect?: (item: News) => void;
};

export const NewsList: React.FC<Props> = ({ news, onSelect }) => {
  if (!news || news.length === 0) {
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
        <div key={item.id}>
          <NewsCard news={item} onClick={() => {onSelect?.(item); console.log('clicke')}} />
        </div>
      ))}
    </div>
  );
};

// src/components/news/NewsCard.tsx
'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NewsCardProps } from "@/types/news";

type Props = NewsCardProps & { onClick?: () => void };

export const NewsCard: React.FC<Props> = ({ news, onClick }) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text?: string, maxLength: number = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer outline-none"
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        {news.imageUrl && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg">
            <img
              src={news.imageUrl}
              alt={news.title ?? 'imagen noticia'}
              className="w-full h-full object-cover"
              loading="lazy"
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
    </div>
  );
};

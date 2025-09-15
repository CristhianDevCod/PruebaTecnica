'use client';

import React, { useEffect } from 'react';
import { News } from '@/types/news';

type NewsDetailProps = {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (news: News) => void;
};

export const NewsDetail: React.FC<NewsDetailProps> = ({ news, isOpen, onClose, onEdit }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !news) return null;

  const formatDate = (d: Date | string | undefined) => {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    onEdit?.(news);
    onClose();
  };

  return (
    // Outer: allow scrolling on small screens and place modal a bit lower (items-start)
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-8 pb-8 overflow-auto"
      aria-modal="true"
      role="dialog"
      aria-labelledby="news-detail-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 transition-opacity" />

      {/* Modal panel: limit height and allow internal scrolling */}
      <div
        className="relative z-10 max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image (no grows beyond its height) */}
        {news.imageUrl && (
          <div className="relative w-full flex-shrink-0 h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden bg-gray-100">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="bg-white text-gray-700 shadow-sm h-9 w-9 rounded-full flex items-center justify-center text-lg hover:bg-gray-50 cursor-pointer"
                aria-label="Cerrar detalle"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Content area: scrollable if needed */}
        <div className="p-6 sm:p-8 overflow-y-auto min-h-0">
          <div className="flex items-start justify-between gap-4">
            <div className="pr-8">
              <h2 id="news-detail-title" className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {news.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Por <span className="font-medium text-gray-700">{news.author}</span> · {formatDate(news.date)}
              </p>
            </div>
          </div>

          <hr className="my-4" />

          <article className="prose prose-sm sm:prose lg:prose-base max-w-none text-gray-800">
            <p>{news.body}</p>
          </article>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>
                Publicado: <span className="font-medium text-gray-700">{formatDate(news.createdAt ?? news.date)}</span>
              </p>
              {news.updatedAt && (
                <p className="mt-1">
                  Actualizado: <span className="font-medium text-gray-700">{formatDate(news.updatedAt)}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                Cerrar
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                className="bg-orange-400 text-white border border-gray-200 shadow-sm px-3 py-1 rounded-md text-sm hover:bg-orange-500 cursor-pointer"
                aria-label="Editar noticia"
                title="Editar noticia"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

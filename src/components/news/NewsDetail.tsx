'use client';

import React, { useEffect } from 'react';
import { News } from '@/types/news';

type NewsDetailProps = {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
};

export const NewsDetail: React.FC<NewsDetailProps> = ({ news, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Block body scroll while the modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !news) return null;

  const formatDate = (d: Date | string) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="news-detail-title"
      onClick={onClose} // click fondo cierra
    >
      <div className="absolute inset-0 bg-black/50 transition-opacity" />

      {/* Modal content */}
      <div
        className="relative z-10 max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // evita que el click dentro cierre
      >
        {/* Imagen (opcional) */}
        {news.imageUrl && (
          <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-100">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="news-detail-title" className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {news.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Por <span className="font-medium text-gray-700">{news.author}</span> · {formatDate(news.date)}
              </p>
            </div>

            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onClose}
                aria-label="Cerrar detalle de noticia"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100"
              >
                ✕
              </button>
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

            {/* Acciones (ejemplo: compartir/cerrar). Puedes añadir editar/eliminar aquí */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1 cursor-pointer rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

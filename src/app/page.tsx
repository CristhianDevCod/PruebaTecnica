'use client';

import React, { useMemo, useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { NewsList } from '@/components/news/NewsList';
import { CreateNewsModal } from '@/components/news/CreateNewsModal';
import { NewsDetail } from '@/components/news/NewsDetail';
import { Button } from '@/components/ui/button';
import { News, CreateNewsInput } from '@/types/news';

// Datos de ejemplo
const initialNews: News[] = [
  {
    id: 1,
    title: "Avances en Inteligencia Artificial revolucionan la búsqueda semántica",
    body: "Los nuevos modelos de lenguaje están transformando la manera en que buscamos y encontramos información. La búsqueda semántica permite entender el contexto y significado de las consultas, ofreciendo resultados más precisos y relevantes para los usuarios.",
    author: "María García",
    date: new Date('2024-03-15T10:30:00'),
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
    createdAt: new Date('2024-03-15T10:30:00'),
    updatedAt: new Date('2024-03-15T10:30:00')
  },
  {
    id: 2,
    title: "Next.js 15 introduce nuevas funcionalidades para desarrolladores",
    body: "La última versión del framework de React incluye mejoras significativas en performance, nuevas características del App Router y mejor integración con bases de datos. Los desarrolladores podrán crear aplicaciones más rápidas y eficientes.",
    author: "Carlos Rodríguez",
    date: new Date('2024-03-14T14:20:00'),
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
    createdAt: new Date('2024-03-14T14:20:00'),
    updatedAt: new Date('2024-03-14T14:20:00')
  },
  {
    id: 3,
    title: "PostgreSQL y embeddings: El futuro de las bases de datos vectoriales",
    body: "PostgreSQL se consolida como una excelente opción para almacenar y consultar vectores de embeddings. Con extensiones como pgvector, las bases de datos tradicionales pueden manejar búsquedas de similitud de manera eficiente.",
    author: "Ana Martínez",
    date: new Date('2024-03-13T09:15:00'),
    createdAt: new Date('2024-03-13T09:15:00'),
    updatedAt: new Date('2024-03-13T09:15:00')
  },
  {
    id: 4,
    title: "PostgreSQL y embeddings: El futuro de las bases de datos vectoriales",
    body: "PostgreSQL se consolida como una excelente opción para almacenar y consultar vectores de embeddings. Con extensiones como pgvector, las bases de datos tradicionales pueden manejar búsquedas de similitud de manera eficiente.",
    author: "Ana Martínez",
    date: new Date('2024-03-13T09:15:00'),
    createdAt: new Date('2024-03-13T09:15:00'),
    updatedAt: new Date('2024-03-13T09:15:00')
  },
  {
    id: 5,
    title: "PostgreSQL y embeddings: El futuro de las bases de datos vectoriales",
    body: "PostgreSQL se consolida como una excelente opción para almacenar y consultar vectores de embeddings. Con extensiones como pgvector, las bases de datos tradicionales pueden manejar búsquedas de similitud de manera eficiente.",
    author: "Ana Martínez",
    date: new Date('2024-03-13T09:15:00'),
    createdAt: new Date('2024-03-13T09:15:00'),
    updatedAt: new Date('2024-03-13T09:15:00')
  }
];

export default function HomePage() {
  const [news, setNews] = useState<News[]>(initialNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // detalle
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<News | null>(null);

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;
    const q = searchQuery.toLowerCase();
    return news.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.body.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q)
    );
  }, [news, searchQuery]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleCreateNews = (newNewsData: CreateNewsInput) => {
    const newNews: News = {
      id: Math.max(...news.map(n => n.id), 0) + 1,
      ...newNewsData,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNews(prev => [newNews, ...prev]);
  };

  const handleSelectNews = (item: News) => {
    setSelectedNews(item);
    setIsDetailOpen(true);
  };

  // Abrir editor (llamado desde NewsDetail -> onEdit)
  const handleOpenEdit = (item: News) => {
    setEditTarget(item);
    setIsEditModalOpen(true);
  };

  // Guardar edición: actualiza array y también selectedNews si está abierto
  const handleUpdateNews = (data: CreateNewsInput) => {
    if (!editTarget) return;
    const updated = {
      ...editTarget,
      ...data,
      updatedAt: new Date()
    };
    setNews(prev => prev.map(n => n.id === editTarget.id ? updated : n));
    setSelectedNews(prev => (prev && prev.id === editTarget.id ? updated : prev));
    setIsEditModalOpen(false);
    setEditTarget(null);
    // opcional: mantener modal detalle abierto mostrando la versión actualizada
  };

  const handleDeleteNews = (item: News) => {
  setNews(prev => prev.filter(n => n.id !== item.id));

  // If the detail is open showing that news, close it
  if (selectedNews && selectedNews.id === item.id) {
    setIsDetailOpen(false);
    setSelectedNews(null);
  }

  // If the publisher is open about that story, close it as well
  if (editTarget && editTarget.id === item.id) {
    setIsEditModalOpen(false);
    setEditTarget(null);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Portal de Noticias</h1>
            <span className="text-sm text-gray-500">Búsqueda Semántica con IA</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchBar onSearch={handleSearch} placeholder="Buscar noticias por título, contenido o autor..." />
            <Button onClick={() => setIsCreateModalOpen(true)} className="whitespace-nowrap">+ Nueva Noticia</Button>
          </div>

          {searchQuery && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">Mostrando {filteredNews.length} resultado(s) para "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} className="text-sm text-blue-600 hover:text-blue-800">Limpiar búsqueda</button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{searchQuery ? 'Resultados de búsqueda' : 'Últimas Noticias'}</h2>
            <span className="text-sm text-gray-500">Total: {filteredNews.length} noticia(s)</span>
          </div>

          <NewsList news={filteredNews} onSelect={handleSelectNews} onDelete={handleDeleteNews} />
        </div>
      </main>

      {/* Create (nuevo) */}
      <CreateNewsModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNews}
      />

      {/* Editar (reutiliza CreateNewsModal con initialData y labels) */}
      <CreateNewsModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditTarget(null); }}
        onSubmit={handleUpdateNews}
        initialData={editTarget ? {
          title: editTarget.title,
          body: editTarget.body,
          author: editTarget.author,
          imageUrl: editTarget.imageUrl ?? ''
        } : undefined}
        titleLabel="Editar Noticia"
        submitLabel="Guardar cambios"
      />

      {/* Detalle pasa onEdit para abrir editor */}
      <NewsDetail
        news={selectedNews}
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedNews(null); }}
        onEdit={(n) => handleOpenEdit(n)}
        onDelete={(n) => handleDeleteNews(n)}
      />
    </div>
  );
}




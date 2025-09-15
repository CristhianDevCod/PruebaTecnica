'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { NewsList } from '@/components/news/NewsList';
import { CreateNewsModal } from '@/components/news/CreateNewsModal';
import { NewsDetail } from '@/components/news/NewsDetail';
import { Button } from '@/components/ui/button';
import { News, CreateNewsInput } from '@/types/news';

function mapApiNewsToClient(item: any): News {
  return {
    id: typeof item.id === 'string' ? Number(item.id) : item.id,
    title: item.title,
    body: item.body,
    author: item.author,
    imageUrl: item.imageUrl ?? undefined,
    date: item.date ? new Date(item.date) : new Date(),
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  };
}

export default function HomePage() {
  // <-- inicia vacío y sin datos locales
  const [news, setNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // detalle
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<News | null>(null);

  // loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar noticias desde API al montar (siempre intenta cargar)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error(`Error al obtener noticias: ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const mapped: News[] = Array.isArray(data) ? data.map(mapApiNewsToClient) : [];
        setNews(mapped); // reemplaza (no concat con datos locales)
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message ?? 'Error al cargar noticias');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;
    const q = searchQuery.toLowerCase();
    return news.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q)
    );
  }, [news, searchQuery]);

  const handleSearch = (query: string) => setSearchQuery(query);

  // CREATE -> POST /api/news
  const handleCreateNews = async (newNewsData: CreateNewsInput) => {
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNewsData),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Error creando noticia');
      }
      const created = await res.json();
      const mapped = mapApiNewsToClient(created);
      setNews((prev) => [mapped, ...prev]); // funciona aunque prev sea []
      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Error creando noticia');
    }
  };

  const handleSelectNews = (item: News) => {
    setSelectedNews(item);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (item: News) => {
    setEditTarget(item);
    setIsEditModalOpen(true);
  };

  // UPDATE -> PUT /api/news/:id
  const handleUpdateNews = async (data: CreateNewsInput) => {
    if (!editTarget) return;
    try {
      const res = await fetch(`/api/news/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Error actualizando noticia');
      }
      const updated = await res.json();
      const mapped = mapApiNewsToClient(updated);
      setNews((prev) => prev.map((n) => (n.id === mapped.id ? mapped : n)));
      setSelectedNews((prev) => (prev && prev.id === mapped.id ? mapped : prev));
      setIsEditModalOpen(false);
      setEditTarget(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Error actualizando noticia');
    }
  };

  // DELETE -> DELETE /api/news/:id
  const handleDeleteNews = async (item: News) => {
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'DELETE',
      });
      if (res.status !== 204) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Error eliminando noticia');
      }

      setNews((prev) => prev.filter((n) => n.id !== item.id));

      if (selectedNews && selectedNews.id === item.id) {
        setIsDetailOpen(false);
        setSelectedNews(null);
      }
      if (editTarget && editTarget.id === item.id) {
        setIsEditModalOpen(false);
        setEditTarget(null);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Error eliminando noticia');
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

          {loading && <p className="text-sm text-gray-500 mt-3">Cargando noticias...</p>}
          {error && <p className="text-sm text-red-600 mt-3">Error: {error}</p>}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{searchQuery ? 'Resultados de búsqueda' : 'Últimas Noticias'}</h2>
            <span className="text-sm text-gray-500">Total: {filteredNews.length} noticia(s)</span>
          </div>

          {/* Si no hay noticias y no está cargando mostramos mensaje vacío */}
          {!loading && news.length === 0 && !error ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No hay noticias en la base de datos</div>
              <p className="text-gray-400">Crea la primera noticia para comenzar</p>
            </div>
          ) : (
            <NewsList news={filteredNews} onSelect={handleSelectNews} onDelete={handleDeleteNews} />
          )}
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

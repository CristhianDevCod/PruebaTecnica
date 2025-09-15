'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateNewsInput } from '@/types/news';

interface CreateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (news: CreateNewsInput) => void;
  initialData?: CreateNewsInput; // si viene, el modal actúa en modo "editar"
  titleLabel?: string;
  submitLabel?: string;
}

export const CreateNewsModal: React.FC<CreateNewsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  titleLabel = 'Nueva Noticia',
  submitLabel = 'Crear Noticia'
}) => {
  const [formData, setFormData] = useState<CreateNewsInput>({
    title: '',
    body: '',
    author: '',
    imageUrl: ''
  });

  // Cuando abra en modo edición, rellenar el formulario con initialData
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title ?? '',
        body: initialData.body ?? '',
        author: initialData.author ?? '',
        imageUrl: initialData.imageUrl ?? ''
      });
      return;
    }
    if (!isOpen) {
      // reset al cerrar (si quieres conservar entre aperturas, quita esta rama)
      setFormData({ title: '', body: '', author: '', imageUrl: '' });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.body.trim() && formData.author.trim()) {
      onSubmit({
        title: formData.title.trim(),
        body: formData.body.trim(),
        author: formData.author.trim(),
        imageUrl: formData.imageUrl?.trim() || undefined
      });
      // no hacemos onClose aquí: el caller decide cerrar (pero mantenemos comportamiento previo)
      // Para UX consistente: cerramos y reseteamos
      setFormData({ title: '', body: '', author: '', imageUrl: '' });
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  const inputClasses =
    'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base text-black placeholder-gray-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{titleLabel}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ingresa el título de la noticia"
              required
              className={inputClasses}
            />

            <Input
              label="Autor"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Nombre del autor"
              required
              className={inputClasses}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                placeholder="Escribe el contenido de la noticia"
                rows={6}
                required
                className={inputClasses}
              />
            </div>

            <Input
              label="URL de Imagen (opcional)"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              type="url"
              className={inputClasses}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">{submitLabel}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

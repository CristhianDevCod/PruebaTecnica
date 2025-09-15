// src/types/news.ts
export interface News {
  id: number;
  title: string;
  body: string;
  author: string;
  date: Date;
  imageUrl?: string;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNewsInput {
  title: string;
  body: string;
  author: string;
  imageUrl?: string;
}

export interface NewsListProps {
  news: News[];
}

export interface NewsCardProps {
  news: News;
  onClick?: () => void;
  onDelete?: () => void;
}
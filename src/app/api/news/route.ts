import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const items = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, body: content, author, imageUrl } = body;

  if (!title || !content || !author) {
    return new NextResponse('Missing fields', { status: 400 });
  }

  const created = await prisma.news.create({
    data: {
      title,
      body: content,
      author,
      imageUrl
    }
  });

  return NextResponse.json(created, { status: 201 });
}

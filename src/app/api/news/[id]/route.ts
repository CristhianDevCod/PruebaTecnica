// src/app/api/news/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

async function resolveId(params: any) {
  // params viene como thenable en Next; awaitearlo es la forma recomendada.
  const resolved = await params;
  const id = resolved?.id;
  if (!id) throw new Error('Missing id param');
  const num = Number(id);
  if (Number.isNaN(num)) throw new Error('Invalid id param');
  return num;
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const id = await resolveId(params);
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return new NextResponse('Not found', { status: 404 });
    return NextResponse.json(news);
  } catch (err: any) {
    console.error('GET /api/news/[id] error:', err);
    if (err.message?.includes('Missing') || err.message?.includes('Invalid')) {
      return new NextResponse(err.message, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const id = await resolveId(params);
    const data = await req.json();

    // Basic validation
    if (!data || !data.title || !data.body || !data.author) {
      return new NextResponse('Missing fields (title, body, author)', { status: 400 });
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        body: data.body,
        author: data.author,
        imageUrl: data.imageUrl ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('PUT /api/news/[id] error:', err);
    if (err.message?.includes('Missing') || err.message?.includes('Invalid')) {
      return new NextResponse(err.message, { status: 400 });
    }
    if (err.code === 'P2025') { // Prisma: record not found
      return new NextResponse('Not found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const id = await resolveId(params);
    await prisma.news.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error('DELETE /api/news/[id] error:', err);
    if (err.message?.includes('Missing') || err.message?.includes('Invalid')) {
      return new NextResponse(err.message, { status: 400 });
    }
    if (err.code === 'P2025') {
      return new NextResponse('Not found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

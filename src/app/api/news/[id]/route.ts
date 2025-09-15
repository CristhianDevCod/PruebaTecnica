import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEmbedding } from '@/lib/ai-client';

async function resolveId(params: any) {
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

    if (!data || !data.title || !data.body || !data.author) {
      return new NextResponse('Missing fields (title, body, author)', { status: 400 });
    }

    // Recalcular embedding (opcional)
    let embedding: number[] | undefined = undefined;
    try {
      const emb = await getEmbedding(`${data.title}\n\n${data.body}`);
      if (Array.isArray(emb) && emb.length > 0) embedding = emb;
    } catch (err) {
      console.error('Error generando embedding', err);
      embedding = undefined;
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        body: data.body,
        author: data.author,
        imageUrl: data.imageUrl ?? null,
        ...(embedding ? { embedding } : {})
      }
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err.message?.includes('Missing') || err.message?.includes('Invalid')) {
      return new NextResponse(err.message, { status: 400 });
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

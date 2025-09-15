import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getEmbedding } from '@/lib/ai-client';

export async function GET() {
  const items = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, body: content, author, imageUrl } = body;

    if (!title || !content || !author) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    // Generar embedding (no obligatorio)
    let embedding: number[] | undefined = undefined;
    try {
      const textForEmbedding = `${title}\n\n${content}`;
      const emb = await getEmbedding(textForEmbedding);
      if (Array.isArray(emb) && emb.length > 0) embedding = emb;
    } catch (err) {
      console.error('Error calculando embedding:', err);
      // No bloqueamos la creación si falla el servicio de embeddings
      embedding = undefined;
    }

    const created = await prisma.news.create({
      data: {
        title,
        body: content,
        author,
        imageUrl: imageUrl ?? null,
        // NO pasar null: usar undefined para omitir el campo si no hay embedding
        ...(embedding ? { embedding } : {})
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse('Internal', { status: 500 });
  }
}

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-model:8000';

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text) return [];
  const url = `${AI_SERVICE_URL.replace(/\/$/, '')}/embeddings`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text })
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`AI service error: ${res.status} ${t}`);
    }
    const json = await res.json();
    // Esperamos algo tipo { embedding: number[] } o { data: { embedding: [...] } }
    if (Array.isArray(json.embedding)) return json.embedding;
    if (json.data?.embedding && Array.isArray(json.data.embedding)) return json.data.embedding;
    if (Array.isArray(json.data?.[0]?.embedding)) return json.data[0].embedding;
    throw new Error('Embedding format inválido en respuesta del servicio de IA');
  } catch (err) {
    console.error('getEmbedding error', err);
    throw err;
  }
}

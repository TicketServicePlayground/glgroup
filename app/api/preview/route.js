import { randomUUID } from 'crypto';
import { previewStore } from '@/lib/previewStore';

const ALLOWED_ORIGIN = process.env.ADMIN_PANEL_ORIGIN || 'http://localhost:3001';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-preview-secret',
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request) {
  const secret = request.headers.get('x-preview-secret');
  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders() });
  }

  try {
    const { content, locale } = await request.json();
    if (!content) {
      return Response.json({ error: 'Missing content' }, { status: 400, headers: corsHeaders() });
    }

    const token = randomUUID();
    previewStore.set(token, {
      content,
      locale: locale || 'en',
    });

    return Response.json({ token }, { headers: corsHeaders() });
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() });
  }
}

import { NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, roadmap_context, history } = body;

    const result = await aiService.generateChatResponse(roadmap_context, message, history);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: error.message || 'Failed to chat' }, { status: 500 });
  }
}

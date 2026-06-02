import { NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { js_code, html_code, css_code, error_message } = body;

    const result = await aiService.debugCode(js_code, html_code, css_code, error_message);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error debugging code:', error);
    return NextResponse.json({ error: error.message || 'Failed to debug code' }, { status: 500 });
  }
}

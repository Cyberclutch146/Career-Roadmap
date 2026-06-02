import { NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lesson_title, lesson_description, resources, exercises } = body;

    const markdown = await aiService.summarizeLesson(lesson_title, lesson_description, resources, exercises);

    return NextResponse.json({ markdown_summary: markdown });
  } catch (error: any) {
    console.error('Error summarizing lesson:', error);
    return NextResponse.json({ error: error.message || 'Failed to summarize lesson' }, { status: 500 });
  }
}

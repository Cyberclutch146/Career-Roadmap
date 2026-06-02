import { NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { goal, skill_level } = body;

    const questions = await aiService.generateAssessmentQuiz(goal, skill_level);

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Error generating assessment:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate assessment' }, { status: 500 });
  }
}

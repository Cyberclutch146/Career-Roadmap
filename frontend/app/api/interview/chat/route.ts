import { NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roadmap_goal, phase_name, phase_description, user_answer, history } = body;

    const result = await aiService.generateInterviewResponse(
      roadmap_goal,
      phase_name,
      phase_description,
      user_answer,
      history
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating interview response:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate interview response' }, { status: 500 });
  }
}

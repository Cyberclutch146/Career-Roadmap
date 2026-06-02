import { NextResponse } from 'next/server';
import { aiService } from '@/lib/aiService';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { goal, skill_level, daily_hours, learning_style, target_months, assessment_score } = body;

    const generatedRoadmap = await aiService.generateRoadmap(
      goal,
      skill_level,
      daily_hours,
      learning_style,
      target_months,
      assessment_score
    );

    const now = new Date().toISOString();
    const roadmapId = uuidv4();

    return NextResponse.json({
      id: roadmapId,
      user_id: null, // Will be updated when auth is fully implemented
      goal,
      skill_level,
      daily_hours,
      learning_style,
      target_months,
      generated_roadmap: generatedRoadmap,
      created_at: now,
      updated_at: now
    });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate roadmap' }, { status: 500 });
  }
}

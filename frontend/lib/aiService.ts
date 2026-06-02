import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    if (GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    }
  }

  isAvailable(): boolean {
    return this.model !== null;
  }

  async generateRoadmap(
    goal: string,
    skillLevel: string,
    dailyHours: number,
    learningStyle: string,
    targetMonths: number,
    assessmentScore?: number | null
  ): Promise<any> {
    const prompt = this.createRoadmapPrompt(
      goal, skillLevel, dailyHours, learningStyle, targetMonths, assessmentScore
    );

    if (this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        const text = result.response.text();
        return this.parseJson(text);
      } catch (error) {
        console.error('Gemini API error during roadmap generation', error);
        return this.getFallbackRoadmap(goal, skillLevel, targetMonths);
      }
    } else {
      return this.getFallbackRoadmap(goal, skillLevel, targetMonths);
    }
  }

  async debugCode(jsCode: string, htmlCode: string, cssCode: string, errorMessage: string): Promise<{ explanation: string, fixed_code: string }> {
    const prompt = `You are an expert JavaScript debugger. A student encountered an error while running their code in the browser playground.

### Error Message:
${errorMessage}

### JavaScript Code:
\`\`\`javascript
${jsCode}
\`\`\`

### HTML Code:
\`\`\`html
${htmlCode}
\`\`\`

### CSS Code:
\`\`\`css
${cssCode}
\`\`\`

Analyze the error and provide a fix. Return the response strictly as a JSON object with this exact schema:
{
    "explanation": "A clear, beginner-friendly explanation of why the error occurred and how you fixed it.",
    "fixed_code": "The corrected complete JavaScript code only (no markdown code blocks, just the raw code)."
}
`;
    if (this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        return this.parseJson(result.response.text());
      } catch (error) {
        console.error('Gemini error in debug_code', error);
        return { explanation: 'An error occurred connecting to the AI.', fixed_code: jsCode };
      }
    }
    return { explanation: 'AI model is not available.', fixed_code: jsCode };
  }

  async summarizeLesson(lessonTitle: string, lessonDescription: string, resources: any[], exercises: string[]): Promise<string> {
    const prompt = `You are an expert technical educator. Create a highly condensed, bulleted "Cheat Sheet" or summary for this lesson.

Lesson Title: ${lessonTitle}
Lesson Description: ${lessonDescription}
Resources: ${JSON.stringify(resources)}
Practice Exercises: ${JSON.stringify(exercises)}

Generate a clean, structured Markdown cheat sheet. It should include:
- A brief 1-sentence recap.
- 3-5 core takeaways (bullet points).
- Key terminology/concepts used in this lesson.
- Actionable next steps based on the practice exercises.
Do not wrap the entire response in a markdown code block, just return raw markdown text.
`;
    if (this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
      } catch (error) {
        console.error('Gemini error in summarizeLesson', error);
        return 'An error occurred generating the summary.';
      }
    }
    return 'AI model is not available.';
  }

  async generateAssessmentQuiz(goal: string, skillLevel: string): Promise<any[]> {
    const prompt = `You are an expert technical interviewer. Maintain a professional, direct, and human tone. Do not use emojis.
Generate 5 multiple-choice questions to assess a user's knowledge for the goal: "${goal}" at a "${skillLevel}" level.
The questions should test key concepts of this domain.

Return ONLY a JSON array containing exactly 5 question objects, with this exact structure:
[
  {
    "question": "string - clear and conceptual question",
    "options": ["option A", "option B", "option C", "option D"],
    "answer_index": number (0 to 3),
    "explanation": "string - brief educational explanation of why the answer is correct"
  }
]

Return only valid JSON, no markdown formatting (like \`\`\`json), no surrounding text.`;

    if (this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        return this.parseJson(result.response.text());
      } catch (error) {
        console.error('Assessment quiz generation failed', error);
      }
    }

    return [
      {
        question: `What is the primary foundation of ${goal}?`,
        options: ["Understanding the core principles", "Using libraries without studying basics", "Ignoring best practices", "Copying code blindly"],
        answer_index: 0,
        explanation: "A strong foundation requires understanding the core principles first."
      }
    ];
  }

  async generateChatResponse(roadmapContext: any, userMessage: string, history: any[] = []): Promise<any> {
    // simplified version of the agent logic in python
    const prompt = `You are an AI mentor helping a student following this learning roadmap:
Goal: ${roadmapContext?.goal || 'Learning'}
Current Progress: ${roadmapContext?.progress || 'Just started'}

User: ${userMessage}

Respond in a helpful, concise way. Do not use emojis.`;

    if (this.model) {
      try {
        const chat = this.model.startChat({
          history: history.map(h => ({ role: h.role, parts: [{ text: h.content }] }))
        });
        const result = await chat.sendMessage(prompt);
        return {
          reply: result.response.text(),
          suggestions: ["What should I learn next?", "Explain this in simpler terms"],
          action: null
        };
      } catch (error) {
        console.error('Chat error', error);
        return { reply: "I encountered an error.", suggestions: [], action: null };
      }
    }
    return { reply: "AI model is not available.", suggestions: [], action: null };
  }

  async generateInterviewResponse(roadmapGoal: string, phaseName: string, phaseDescription: string, userAnswer: string, history: any[]): Promise<any> {
    const currentQuestionIndex = history.length;
    const totalQuestions = 3;

    if (currentQuestionIndex === 0) {
      const prompt = `You are an elite technical interviewer. Maintain a professional, direct, and human tone. Do not use emojis. Start a mock interview for a candidate learning "${roadmapGoal}", focusing on the phase: "${phaseName}" (${phaseDescription}).
Ask the FIRST question. Keep it clear, conceptual, and relevant to the phase's topics.
Do not say hello or provide intro filler, just output the interview question directly in 1-2 sentences.`;
      
      let question = `Could you explain the core concepts of ${phaseName} and how they are typically applied?`;
      if (this.model) {
        try {
          const result = await this.model.generateContent(prompt);
          question = result.response.text().trim();
        } catch(e) {}
      }
      return {
        next_question: question,
        feedback: null,
        final_evaluation: null,
        history: [{ question, answer: null, feedback: null }]
      };
    }

    const lastQuestion = history[history.length - 1].question;
    const evalPrompt = `You are an elite technical interviewer. Maintain a professional, direct, and human tone. Do not use emojis.
Candidate is interviewing for "${roadmapGoal}" in the phase "${phaseName}" (${phaseDescription}).

Question asked: ${lastQuestion}
Candidate's answer: ${userAnswer}

Provide constructive feedback (2-3 sentences) evaluating their answer. Mention what they got right, and any missing details. Be encouraging but honest.
Output ONLY the feedback, no filler.`;

    let feedback = "Good start!";
    if (this.model) {
      try {
        const res = await this.model.generateContent(evalPrompt);
        feedback = res.response.text().trim();
      } catch(e) {}
    }

    const updatedHistory = [...history];
    updatedHistory[updatedHistory.length - 1].answer = userAnswer;
    updatedHistory[updatedHistory.length - 1].feedback = feedback;

    if (currentQuestionIndex < totalQuestions) {
      const nextPrompt = `Ask the NEXT question (Question ${currentQuestionIndex + 1} of ${totalQuestions}) for this phase. Ensure it doesn't overlap with previous questions. Output ONLY the question directly in 1-2 sentences.`;
      let nextQuestion = "What are the common strategies for this?";
      if (this.model) {
        try {
          const res = await this.model.generateContent(nextPrompt);
          nextQuestion = res.response.text().trim();
        } catch(e) {}
      }
      updatedHistory.push({ question: nextQuestion, answer: null, feedback: null });
      return { next_question: nextQuestion, feedback, final_evaluation: null, history: updatedHistory };
    } else {
      const summaryPrompt = `Provide a final evaluation report for the candidate based on the interview. Include Overall Score, Key Strengths, Areas for Improvement, and a recommendation.`;
      let finalEval = "### Interview Completed\\n\\n**Score: 80/100**";
      if (this.model) {
        try {
           const res = await this.model.generateContent(summaryPrompt);
           finalEval = res.response.text().trim();
        } catch(e) {}
      }
      return { next_question: null, feedback, final_evaluation: finalEval, history: updatedHistory };
    }
  }

  private parseJson(text: string): any {
    let jsonStr = text.trim();
    if (jsonStr.startsWith('\`\`\`json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('\`\`\`')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('\`\`\`')) jsonStr = jsonStr.slice(0, -3);
    try {
      return JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error('Failed to parse JSON', e);
      return {};
    }
  }

  private createRoadmapPrompt(
    goal: string,
    skillLevel: string,
    dailyHours: number,
    learningStyle: string,
    targetMonths: number,
    assessmentScore?: number | null
  ): string {
    const totalHoursEstimate = dailyHours * 30 * targetMonths;
    let assessmentInstr = "";
    if (assessmentScore !== undefined && assessmentScore !== null) {
      assessmentInstr = `\nUser has taken a skill assessment for this goal and scored ${(assessmentScore * 100).toFixed(1)}%. `;
      if (assessmentScore >= 0.7) {
        assessmentInstr += "Since they scored high, you MUST customize the roadmap by pre-marking basic/introductory lessons or chapters as completed. That is, set 'completed': true for the lessons and chapters that cover simple definitions, setup, or core concepts the user already demonstrated knowledge of. This allows them to skip ahead.";
      } else {
        assessmentInstr += "Since they scored lower/medium, do not pre-complete lessons but ensure explanations and exercises are helpful and tailored to their current skill level.";
      }
    }

    return `You are an expert educational advisor creating a comprehensive learning roadmap. Maintain a professional, direct, and human tone. Do not use emojis.

Create a detailed structured roadmap for someone who wants to: ${goal}
Current skill level: ${skillLevel}
Daily study time: ${dailyHours} hours (${totalHoursEstimate} total hours over ${targetMonths} months)
Preferred learning style: ${learningStyle}
Target duration: ${targetMonths} months

Generate a comprehensive roadmap in JSON format with this exact structure:
{
    "overview": {
        "title": "string - clear goal-oriented title",
        "description": "string - 2-3 sentences about what the learner will achieve",
        "total_estimated_hours": number,
        "total_lessons": number,
        "total_chapters": number,
        "difficulty_start": "string",
        "difficulty_end": "string"
    },
    "learning_objectives": [
        {
            "id": "lo_1",
            "objective": "string - specific measurable objective",
            "mastered": false
        }
    ],
    "timeline_weeks": [
        {
            "week": number,
            "focus": "string - main theme of the week",
            "tasks": ["string - specific tasks for the week"]
        }
    ],
    "phases": [
        {
            "id": "phase_1",
            "name": "string - phase name (e.g., Foundation, Building, Advanced)",
            "description": "string - 1-2 sentences",
            "chapters": [
                {
                    "id": "ch_1",
                    "title": "string - chapter title",
                    "description": "string - 1-2 sentences",
                    "estimated_hours": number,
                    "lessons": [
                        {
                            "id": "lesson_1",
                            "title": "string - lesson title",
                            "description": "string - 2-3 sentences about what will be learned",
                            "duration_minutes": number,
                            "resources": [
                                {
                                    "type": "documentation|video|article|course|github|practice",
                                    "title": "string",
                                    "url": "string - real or realistic URL",
                                    "description": "string - brief description",
                                    "difficulty": "beginner|intermediate|advanced",
                                    "rating": number
                                }
                            ],
                            "practice_exercises": ["string - specific exercises"],
                            "completed": false
                        }
                    ],
                    "completed": false
                }
            ],
            "estimated_weeks": number,
            "completed": false
        }
    ],
    "resources": {
        "documentation": [],
        "videos": [],
        "articles": [],
        "courses": [],
        "github": [],
        "practice": []
    },
    "revision_strategy": "string - detailed revision approach",
    "interview_preparation": "string - interview prep guidance",
    "final_assessment": "string - how to assess mastery"
}

Important:
1. The roadmap should be realistic and achievable
2. Include 3-4 phases with 2-4 chapters each
3. Each chapter should have 3-6 lessons
4. Total lessons should be between 30-80 depending on scope
5. Provide 2-3 resources per lesson
6. Resources should be real or realistic (use realistic URLs like example.com for fictional)
7. Timelines should be proportional to the target duration
8. Lessons should build progressively from fundamentals to advanced topics${assessmentInstr}

Return ONLY the JSON, no additional text or explanation.`;
  }

  private getFallbackRoadmap(goal: string, skillLevel: string, targetMonths: number): any {
    const isBeginner = skillLevel.toLowerCase() === 'beginner';
    const totalHours = 100;
    const totalLessons = 10;
    return {
        "overview": {
            "title": `Your Path to ${goal}`,
            "description": `A comprehensive ${targetMonths}-month learning journey to achieve your goal of ${goal}.`,
            "total_estimated_hours": totalHours,
            "total_lessons": totalLessons,
            "total_chapters": 1,
            "difficulty_start": isBeginner ? "Beginner" : "Intermediate",
            "difficulty_end": "Advanced"
        },
        "learning_objectives": [
            {"id": "lo_1", "objective": `Understand the fundamentals of ${goal}`, "mastered": false}
        ],
        "timeline_weeks": [
            {"week": 1, "focus": "Week 1 Learning", "tasks": ["Complete assigned lessons and exercises"]}
        ],
        "phases": [
          {
            "id": "phase_1",
            "name": "Getting Started",
            "description": "Set up your development environment",
            "estimated_weeks": 4,
            "completed": false,
            "chapters": [
                {
                    "id": "ch_1",
                    "title": "Introduction",
                    "description": `Introduction to ${goal}`,
                    "estimated_hours": 15,
                    "completed": false,
                    "lessons": [
                        {"id": "lesson_1", "title": "What is " + goal + "?", "description": "Overview and applications", "duration_minutes": 30, "resources": [], "practice_exercises": ["Research applications"], "completed": false}
                    ]
                }
            ]
          }
        ],
        "resources": {
            "documentation": [],
            "videos": [],
            "articles": [],
            "courses": [],
            "github": [],
            "practice": []
        },
        "revision_strategy": "Spaced repetition.",
        "interview_preparation": "Practice coding problems daily.",
        "final_assessment": "Complete a capstone project."
    };
  }
}

export const aiService = new AIService();

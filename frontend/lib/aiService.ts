import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization — resolved on first use so env vars are always available
let _genAI: GoogleGenerativeAI | null = null;
let _model: any = null;
let _initialized = false;

function getModel() {
  if (!_initialized) {
    _initialized = true;
    const key = process.env.GEMINI_API_KEY || '';
    if (key) {
      _genAI = new GoogleGenerativeAI(key);
      _model = _genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    } else {
      console.warn('[AIService] GEMINI_API_KEY is not set — all requests will use fallback templates.');
    }
  }
  return _model;
}

class AIService {

  isAvailable(): boolean {
    return getModel() !== null;
  }

  // ----- Roadmap Generation -----
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

    const model = getModel();
    if (model) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = this.parseJson(text);
        if (parsed && typeof parsed === 'object' && parsed.phases) {
          return parsed;
        }
        console.warn('[AIService] Gemini returned unparsable roadmap, using fallback.');
      } catch (error) {
        console.error('[AIService] Gemini API error during roadmap generation:', error);
      }
    }
    return this.getFallbackRoadmap(goal, skillLevel, targetMonths);
  }

  // ----- Code Debugger -----
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
    const model = getModel();
    if (model) {
      try {
        const result = await model.generateContent(prompt);
        const parsed = this.parseJson(result.response.text());
        if (parsed && parsed.explanation) {
          return parsed;
        }
      } catch (error) {
        console.error('[AIService] Gemini error in debugCode:', error);
      }
    }
    return { explanation: 'AI is currently unavailable. Please check your code manually or try again later.', fixed_code: jsCode };
  }

  // ----- Lesson Summarizer -----
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
    const model = getModel();
    if (model) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (error) {
        console.error('[AIService] Gemini error in summarizeLesson:', error);
      }
    }
    return `## ${lessonTitle}\n\n${lessonDescription}\n\n*AI summary is currently unavailable. Review the resources and exercises below to study this lesson.*`;
  }

  // ----- Assessment Quiz -----
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

    const model = getModel();
    if (model) {
      try {
        const result = await model.generateContent(prompt);
        const parsed = this.parseJson(result.response.text());
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error('[AIService] Assessment quiz generation failed:', error);
      }
    }

    return this.getFallbackQuiz(goal);
  }

  private getFallbackQuiz(goal: string): any[] {
    return [
      {
        question: `What is the primary foundation of ${goal}?`,
        options: ["Understanding the core principles", "Using libraries without studying basics", "Ignoring best practices", "Copying code blindly"],
        answer_index: 0,
        explanation: "A strong foundation requires understanding the core principles first."
      },
      {
        question: `Which of the following is a recommended practice when learning ${goal}?`,
        options: ["Continuous learning and hands-on practice", "Memorizing code snippets without understanding", "Never testing your code", "Avoiding documentation"],
        answer_index: 0,
        explanation: "Active learning, testing, and documentation are crucial for success."
      },
      {
        question: "What is the role of version control (like Git) in software development?",
        options: ["To track changes and collaborate with others", "To write faster code", "To compile the application", "To design user interfaces"],
        answer_index: 0,
        explanation: "Git helps track revisions, manage code history, and coordinate work among developers."
      },
      {
        question: "How should you approach difficult concepts when learning a new technology?",
        options: ["Break them into smaller pieces and build mini-projects", "Skip them completely", "Wait for someone else to explain", "Only read about them without practicing"],
        answer_index: 0,
        explanation: "Breaking complex subjects into small, digestible parts and implementing them makes learning effective."
      },
      {
        question: "Why is writing clean, readable code important?",
        options: ["It makes code easier to read, maintain, and debug", "It is required for code to compile", "It makes the program run 10x faster", "It is only relevant for senior developers"],
        answer_index: 0,
        explanation: "Clean code ensures readability and long-term maintainability of a software project."
      }
    ];
  }

  // ----- AI Mentor Chat -----
  async generateChatResponse(roadmapContext: any, userMessage: string, history: any[] = []): Promise<any> {
    const prompt = `You are an AI mentor helping a student following this learning roadmap:
Goal: ${roadmapContext?.goal || 'Learning'}
Current Progress: ${roadmapContext?.progress || 'Just started'}

User: ${userMessage}

Respond in a helpful, concise way. Do not use emojis.`;

    const model = getModel();
    if (model) {
      try {
        // Map 'assistant' role to 'model' for the Gemini API
        const geminiHistory = history
          .filter(h => h.role && h.content)
          .map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          }));

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(prompt);
        return {
          reply: result.response.text(),
          suggestions: ["What should I learn next?", "Explain this in simpler terms"],
          action: null
        };
      } catch (error) {
        console.error('[AIService] Chat error:', error);
      }
    }
    return {
      reply: "I'm currently unable to connect to the AI service. Please try again in a moment, or check that your GEMINI_API_KEY is configured.",
      suggestions: ["Try again"],
      action: null
    };
  }

  // ----- Mock Interview -----
  async generateInterviewResponse(roadmapGoal: string, phaseName: string, phaseDescription: string, userAnswer: string, history: any[]): Promise<any> {
    const currentQuestionIndex = history.length;
    const totalQuestions = 3;
    const model = getModel();

    if (currentQuestionIndex === 0) {
      const prompt = `You are an elite technical interviewer. Maintain a professional, direct, and human tone. Do not use emojis. Start a mock interview for a candidate learning "${roadmapGoal}", focusing on the phase: "${phaseName}" (${phaseDescription}).
Ask the FIRST question. Keep it clear, conceptual, and relevant to the phase's topics.
Do not say hello or provide intro filler, just output the interview question directly in 1-2 sentences.`;
      
      let question = `Could you explain the core concepts of ${phaseName} and how they are typically applied?`;
      if (model) {
        try {
          const result = await model.generateContent(prompt);
          question = result.response.text().trim();
        } catch(e) {
          console.error('[AIService] Interview start error:', e);
        }
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

    let feedback = "Good start! Your answer demonstrates some understanding of the topic. Consider expanding on practical applications and edge cases for a stronger response.";
    if (model) {
      try {
        const res = await model.generateContent(evalPrompt);
        feedback = res.response.text().trim();
      } catch(e) {
        console.error('[AIService] Interview eval error:', e);
      }
    }

    const updatedHistory = [...history];
    updatedHistory[updatedHistory.length - 1].answer = userAnswer;
    updatedHistory[updatedHistory.length - 1].feedback = feedback;

    if (currentQuestionIndex < totalQuestions) {
      const nextPrompt = `You are an elite technical interviewer for "${roadmapGoal}", phase "${phaseName}".
Previous questions asked: ${history.map(h => h.question).join('; ')}
Ask the NEXT question (Question ${currentQuestionIndex + 1} of ${totalQuestions}). Ensure it doesn't overlap with previous questions. Output ONLY the question directly in 1-2 sentences.`;
      let nextQuestion = `What are some common challenges developers face with ${phaseName}, and how would you address them?`;
      if (model) {
        try {
          const res = await model.generateContent(nextPrompt);
          nextQuestion = res.response.text().trim();
        } catch(e) {
          console.error('[AIService] Interview next question error:', e);
        }
      }
      updatedHistory.push({ question: nextQuestion, answer: null, feedback: null });
      return { next_question: nextQuestion, feedback, final_evaluation: null, history: updatedHistory };
    } else {
      const summaryPrompt = `You are an elite technical interviewer. The candidate completed a ${totalQuestions}-question mock interview for "${roadmapGoal}", phase "${phaseName}".

Here is the full interview transcript:
${updatedHistory.map((h, i) => `Q${i+1}: ${h.question}\nA${i+1}: ${h.answer}\nFeedback: ${h.feedback}`).join('\n\n')}

Provide a final evaluation report in markdown format. Include: Overall Score (out of 100), Key Strengths, Areas for Improvement, and a recommendation for next steps.`;
      let finalEval = `### Interview Completed\n\n**Score: 75/100**\n\n**Key Strengths:** You showed willingness to engage with the material.\n\n**Areas for Improvement:** Focus on providing more specific technical details and real-world examples.\n\n**Recommendation:** Review the core concepts of ${phaseName} and practice explaining them out loud.`;
      if (model) {
        try {
           const res = await model.generateContent(summaryPrompt);
           finalEval = res.response.text().trim();
        } catch(e) {
          console.error('[AIService] Interview summary error:', e);
        }
      }
      return { next_question: null, feedback, final_evaluation: finalEval, history: updatedHistory };
    }
  }

  // ----- Utilities -----
  private parseJson(text: string): any {
    let jsonStr = text.trim();
    // Strip markdown code fences if present (handles ```json ... ``` and ``` ... ```)
    const fenceMatch = jsonStr.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1];
    }
    try {
      return JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error('[AIService] Failed to parse JSON from AI response:', e);
      return null;
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
    const weeksPerPhase = Math.max(2, Math.round((targetMonths * 4) / 3));

    return {
        "overview": {
            "title": `Your Path to ${goal}`,
            "description": `A structured ${targetMonths}-month learning journey designed to take you from ${isBeginner ? 'the basics' : 'your current level'} to proficiency in ${goal}. This roadmap covers foundational concepts, practical application, and advanced topics.`,
            "total_estimated_hours": targetMonths * 40,
            "total_lessons": 30,
            "total_chapters": 6,
            "difficulty_start": isBeginner ? "Beginner" : "Intermediate",
            "difficulty_end": "Advanced"
        },
        "learning_objectives": [
            {"id": "lo_1", "objective": `Understand the core fundamentals of ${goal}`, "mastered": false},
            {"id": "lo_2", "objective": `Build practical projects using ${goal} concepts`, "mastered": false},
            {"id": "lo_3", "objective": `Apply advanced techniques and best practices`, "mastered": false}
        ],
        "timeline_weeks": [
            {"week": 1, "focus": "Environment Setup & Fundamentals", "tasks": ["Set up development tools", "Complete introductory lessons"]},
            {"week": 2, "focus": "Core Concepts Deep Dive", "tasks": ["Study key principles", "Complete practice exercises"]},
            {"week": 3, "focus": "Hands-on Practice", "tasks": ["Build a mini-project", "Review and reinforce concepts"]},
            {"week": 4, "focus": "Intermediate Topics", "tasks": ["Explore intermediate concepts", "Start building portfolio projects"]}
        ],
        "phases": [
          {
            "id": "phase_1",
            "name": "Foundation",
            "description": `Build a solid understanding of ${goal} fundamentals and set up your learning environment.`,
            "estimated_weeks": weeksPerPhase,
            "completed": false,
            "chapters": [
                {
                    "id": "ch_1",
                    "title": `Introduction to ${goal}`,
                    "description": `Learn what ${goal} is, its history, and why it matters in the industry.`,
                    "estimated_hours": 8,
                    "completed": false,
                    "lessons": [
                        {"id": "lesson_1", "title": `What is ${goal}?`, "description": `An overview of ${goal}, its core purpose, and common applications in the real world.`, "duration_minutes": 45, "resources": [{"type": "article", "title": "Getting Started Guide", "url": "https://developer.mozilla.org", "description": "Official getting started documentation", "difficulty": "beginner", "rating": 5}], "practice_exercises": ["Research three real-world applications", "Write a summary of what you learned"], "completed": false},
                        {"id": "lesson_2", "title": "Setting Up Your Environment", "description": "Install and configure all necessary tools, editors, and dependencies for your learning journey.", "duration_minutes": 60, "resources": [{"type": "documentation", "title": "Installation Guide", "url": "https://code.visualstudio.com", "description": "Set up VS Code and extensions", "difficulty": "beginner", "rating": 5}], "practice_exercises": ["Install all required tools", "Create your first project folder"], "completed": false},
                        {"id": "lesson_3", "title": "Core Terminology & Concepts", "description": "Learn the essential vocabulary and mental models you need to understand the rest of the curriculum.", "duration_minutes": 45, "resources": [{"type": "article", "title": "Key Concepts Glossary", "url": "https://www.w3schools.com", "description": "Reference for key terms", "difficulty": "beginner", "rating": 4}], "practice_exercises": ["Create a personal glossary of 10 key terms", "Explain each term in your own words"], "completed": false}
                    ]
                },
                {
                    "id": "ch_2",
                    "title": "Fundamental Building Blocks",
                    "description": `Master the basic building blocks and syntax that form the backbone of ${goal}.`,
                    "estimated_hours": 12,
                    "completed": false,
                    "lessons": [
                        {"id": "lesson_4", "title": "Basic Syntax & Structure", "description": `Learn the fundamental syntax rules and structural patterns used in ${goal}.`, "duration_minutes": 60, "resources": [{"type": "video", "title": "Syntax Crash Course", "url": "https://www.youtube.com", "description": "Video walkthrough of core syntax", "difficulty": "beginner", "rating": 4}], "practice_exercises": ["Write 5 basic examples", "Debug 3 syntax errors"], "completed": false},
                        {"id": "lesson_5", "title": "Data Types & Variables", "description": "Understand how data is represented, stored, and manipulated.", "duration_minutes": 45, "resources": [{"type": "documentation", "title": "Data Types Reference", "url": "https://developer.mozilla.org", "description": "Official data types documentation", "difficulty": "beginner", "rating": 5}], "practice_exercises": ["Create examples for each data type", "Build a small data converter"], "completed": false}
                    ]
                }
            ]
          },
          {
            "id": "phase_2",
            "name": "Building Skills",
            "description": `Apply your foundational knowledge to build practical skills and start creating projects with ${goal}.`,
            "estimated_weeks": weeksPerPhase,
            "completed": false,
            "chapters": [
                {
                    "id": "ch_3",
                    "title": "Intermediate Concepts",
                    "description": `Explore more complex patterns and techniques essential for real-world ${goal} work.`,
                    "estimated_hours": 15,
                    "completed": false,
                    "lessons": [
                        {"id": "lesson_6", "title": "Control Flow & Logic", "description": "Master conditional logic, loops, and control flow patterns to build dynamic solutions.", "duration_minutes": 60, "resources": [{"type": "course", "title": "Interactive Tutorial", "url": "https://www.freecodecamp.org", "description": "Free interactive coding exercises", "difficulty": "intermediate", "rating": 5}], "practice_exercises": ["Build a decision-making program", "Implement 3 different loop patterns"], "completed": false},
                        {"id": "lesson_7", "title": "Functions & Modularity", "description": "Learn to write reusable, modular code using functions, parameters, and return values.", "duration_minutes": 60, "resources": [{"type": "article", "title": "Functions Best Practices", "url": "https://developer.mozilla.org", "description": "Guide to writing clean functions", "difficulty": "intermediate", "rating": 4}], "practice_exercises": ["Refactor code into functions", "Build a utility library"], "completed": false},
                        {"id": "lesson_8", "title": "Error Handling & Debugging", "description": "Learn systematic approaches to finding and fixing bugs in your code.", "duration_minutes": 45, "resources": [{"type": "video", "title": "Debugging Masterclass", "url": "https://www.youtube.com", "description": "Step-by-step debugging techniques", "difficulty": "intermediate", "rating": 4}], "practice_exercises": ["Debug 5 pre-written buggy programs", "Set up debugging tools in your editor"], "completed": false}
                    ]
                },
                {
                    "id": "ch_4",
                    "title": "Your First Project",
                    "description": "Apply everything you have learned by building a complete project from scratch.",
                    "estimated_hours": 20,
                    "completed": false,
                    "lessons": [
                        {"id": "lesson_9", "title": "Project Planning", "description": "Learn how to plan a project, break it into tasks, and set realistic milestones.", "duration_minutes": 45, "resources": [{"type": "article", "title": "Project Planning for Developers", "url": "https://www.atlassian.com", "description": "Guide to planning dev projects", "difficulty": "intermediate", "rating": 4}], "practice_exercises": ["Write a project brief", "Create a task breakdown"], "completed": false},
                        {"id": "lesson_10", "title": "Building the Core Features", "description": "Implement the core functionality of your project step-by-step.", "duration_minutes": 120, "resources": [{"type": "github", "title": "Starter Template", "url": "https://github.com", "description": "A boilerplate starter project", "difficulty": "intermediate", "rating": 4}], "practice_exercises": ["Implement the main feature", "Write basic tests"], "completed": false}
                    ]
                }
            ]
          },
          {
            "id": "phase_3",
            "name": "Advanced & Mastery",
            "description": `Level up with advanced topics, performance optimization, and industry best practices for ${goal}.`,
            "estimated_weeks": weeksPerPhase,
            "completed": false,
            "chapters": [
                {
                    "id": "ch_5",
                    "title": "Advanced Patterns",
                    "description": "Learn advanced design patterns, architecture, and optimization techniques used by professionals.",
                    "estimated_hours": 15,
                    "completed": false,
                    "lessons": [
                        {"id": "lesson_11", "title": "Design Patterns & Architecture", "description": "Study common design patterns and architectural approaches used in production systems.", "duration_minutes": 60, "resources": [{"type": "article", "title": "Design Patterns Guide", "url": "https://refactoring.guru", "description": "Visual guide to design patterns", "difficulty": "advanced", "rating": 5}], "practice_exercises": ["Implement 2 design patterns", "Refactor existing code using patterns"], "completed": false},
                        {"id": "lesson_12", "title": "Performance & Optimization", "description": "Learn to identify and fix performance bottlenecks to build fast, efficient applications.", "duration_minutes": 60, "resources": [{"type": "documentation", "title": "Performance Best Practices", "url": "https://web.dev", "description": "Google's performance optimization guide", "difficulty": "advanced", "rating": 5}], "practice_exercises": ["Profile and optimize a slow program", "Benchmark before and after"], "completed": false},
                        {"id": "lesson_13", "title": "Testing & Quality Assurance", "description": "Write comprehensive tests to ensure your code is reliable and maintainable.", "duration_minutes": 60, "resources": [{"type": "course", "title": "Testing Fundamentals", "url": "https://www.freecodecamp.org", "description": "Free course on testing", "difficulty": "advanced", "rating": 4}], "practice_exercises": ["Write unit tests for your project", "Achieve 80% code coverage"], "completed": false}
                    ]
                },
                {
                    "id": "ch_6",
                    "title": "Capstone Project & Review",
                    "description": "Consolidate everything into a portfolio-worthy capstone project and prepare for the next level.",
                    "estimated_hours": 25,
                    "completed": false,
                    "lessons": [
                        {"id": "lesson_14", "title": "Capstone Project", "description": "Build a comprehensive project that showcases all the skills you have acquired throughout this roadmap.", "duration_minutes": 180, "resources": [{"type": "github", "title": "Project Ideas Repository", "url": "https://github.com", "description": "Curated list of project ideas by difficulty", "difficulty": "advanced", "rating": 4}], "practice_exercises": ["Complete the full capstone project", "Write documentation for your project"], "completed": false},
                        {"id": "lesson_15", "title": "Review & Next Steps", "description": "Review your progress, identify gaps, and plan your continued learning journey beyond this roadmap.", "duration_minutes": 45, "resources": [{"type": "article", "title": "Continuous Learning Guide", "url": "https://www.coursera.org", "description": "Guide to lifelong learning in tech", "difficulty": "advanced", "rating": 4}], "practice_exercises": ["Write a self-assessment", "Create a 3-month follow-up plan"], "completed": false}
                    ]
                }
            ]
          }
        ],
        "resources": {
            "documentation": [{"type": "documentation", "title": "Official Documentation", "url": "https://developer.mozilla.org", "description": "The official reference documentation", "difficulty": "beginner", "rating": 5}],
            "videos": [{"type": "video", "title": "Complete Course", "url": "https://www.youtube.com", "description": "Full video course for beginners to advanced", "difficulty": "beginner", "rating": 5}],
            "articles": [],
            "courses": [{"type": "course", "title": "Interactive Learning Platform", "url": "https://www.freecodecamp.org", "description": "Free interactive coding platform", "difficulty": "beginner", "rating": 5}],
            "github": [],
            "practice": []
        },
        "revision_strategy": "Use spaced repetition: review concepts after 1 day, 3 days, 1 week, and 2 weeks. Teach what you learn to solidify understanding.",
        "interview_preparation": "Practice explaining concepts out loud, solve coding challenges daily, and do mock interviews with peers.",
        "final_assessment": "Complete the capstone project, present it to a peer for review, and pass a self-assessment quiz covering all phases."
    };
  }
}

export const aiService = new AIService();

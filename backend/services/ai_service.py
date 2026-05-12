import os
import json
import google.generativeai as genai
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


class AIService:
    def __init__(self):
        self.model = None
        if GEMINI_API_KEY:
            self.model = genai.GenerativeModel("gemini-pro")

    def is_available(self) -> bool:
        return self.model is not None

    async def generate_roadmap(
        self,
        goal: str,
        skill_level: str,
        daily_hours: float,
        learning_style: str,
        target_months: int
    ) -> Dict[str, Any]:
        prompt = self._create_roadmap_prompt(
            goal, skill_level, daily_hours, learning_style, target_months
        )

        if self.model:
            try:
                response = self.model.generate_content(prompt)
                roadmap_text = response.text
                return self._parse_roadmap_response(roadmap_text)
            except Exception as e:
                print(f"Gemini API error: {e}")
                return self._get_fallback_roadmap(goal, skill_level, target_months)
        else:
            return self._get_fallback_roadmap(goal, skill_level, target_months)

    def _create_roadmap_prompt(
        self,
        goal: str,
        skill_level: str,
        daily_hours: float,
        learning_style: str,
        target_months: int
    ) -> str:
        total_hours_estimate = daily_hours * 30 * target_months

        return f"""You are an expert educational advisor creating a comprehensive learning roadmap.

Create a detailed structured roadmap for someone who wants to: {goal}
Current skill level: {skill_level}
Daily study time: {{daily_hours}} hours ({{total_hours_estimate}} total hours over {target_months} months)
Preferred learning style: {learning_style}
Target duration: {target_months} months

Generate a comprehensive roadmap in JSON format with this exact structure:
{{
    "overview": {{
        "title": "string - clear goal-oriented title",
        "description": "string - 2-3 sentences about what the learner will achieve",
        "total_estimated_hours": number,
        "total_lessons": number,
        "total_chapters": number,
        "difficulty_start": "string",
        "difficulty_end": "string"
    }},
    "learning_objectives": [
        {{
            "id": "lo_1",
            "objective": "string - specific measurable objective",
            "mastered": false
        }}
    ],
    "timeline_weeks": [
        {{
            "week": number,
            "focus": "string - main theme of the week",
            "tasks": ["string - specific tasks for the week"]
        }}
    ],
    "phases": [
        {{
            "id": "phase_1",
            "name": "string - phase name (e.g., Foundation, Building, Advanced)",
            "description": "string - 1-2 sentences",
            "chapters": [
                {{
                    "id": "ch_1",
                    "title": "string - chapter title",
                    "description": "string - 1-2 sentences",
                    "estimated_hours": number,
                    "lessons": [
                        {{
                            "id": "lesson_1",
                            "title": "string - lesson title",
                            "description": "string - 2-3 sentences about what will be learned",
                            "duration_minutes": number,
                            "resources": [
                                {{
                                    "type": "documentation|video|article|course|github|practice",
                                    "title": "string",
                                    "url": "string - real or realistic URL",
                                    "description": "string - brief description",
                                    "difficulty": "beginner|intermediate|advanced",
                                    "rating": number between 1-5
                                }}
                            ],
                            "practice_exercises": ["string - specific exercises"],
                            "completed": false
                        }}
                    ],
                    "completed": false
                }}
            ],
            "estimated_weeks": number,
            "completed": false
        }}
    ],
    "resources": {{
        "documentation": [],
        "videos": [],
        "articles": [],
        "courses": [],
        "github": [],
        "practice": []
    }},
    "revision_strategy": "string - detailed revision approach",
    "interview_preparation": "string - interview prep guidance",
    "final_assessment": "string - how to assess mastery"
}}

Important:
1. The roadmap should be realistic and achievable
2. Include 3-4 phases with 2-4 chapters each
3. Each chapter should have 3-6 lessons
4. Total lessons should be between 30-80 depending on scope
5. Provide 2-3 resources per lesson
6. Resources should be real or realistic (use realistic URLs like example.com for fictional)
7. Timelines should be proportional to the target duration
8. Lessons should build progressively from fundamentals to advanced topics

Return ONLY the JSON, no additional text or explanation."""

    def _parse_roadmap_response(self, response_text: str) -> Dict[str, Any]:
        try:
            json_str = response_text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:]
            if json_str.startswith("```"):
                json_str = json_str[3:]
            if json_str.endswith("```"):
                json_str = json_str[:-3]

            roadmap = json.loads(json_str.strip())
            return roadmap
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            return self._get_fallback_roadmap("Learn Programming", "beginner", 6)

    def _get_fallback_roadmap(
        self,
        goal: str,
        skill_level: str,
        target_months: int
    ) -> Dict[str, Any]:
        is_beginner = skill_level.lower() == "beginner"
        weeks = target_months * 4

        phases = []
        if "full stack" in goal.lower():
            phases = self._generate_fullstack_roadmap(weeks)
        elif "dsa" in goal.lower() or "placements" in goal.lower():
            phases = self._generate_dsa_roadmap(weeks)
        elif "ai" in goal.lower() or "machine learning" in goal.lower():
            phases = self._generate_ai_roadmap(weeks)
        elif "cybersecurity" in goal.lower():
            phases = self._generate_cybersecurity_roadmap(weeks)
        elif "react" in goal.lower():
            phases = self._generate_react_roadmap(weeks)
        elif "gate cse" in goal.lower():
            phases = self._generate_gate_cse_roadmap(weeks)
        else:
            phases = self._generate_programming_roadmap(weeks, goal)

        total_lessons = sum(
            len(ch["lessons"])
            for phase in phases
            for ch in phase["chapters"]
        )
        total_hours = sum(
            ch["estimated_hours"]
            for phase in phases
            for ch in phase["chapters"]
        )

        return {
            "overview": {
                "title": f"Your Path to {goal}",
                "description": f"A comprehensive {target_months}-month learning journey to achieve your goal of {goal}. This structured roadmap will guide you from fundamentals to advanced mastery.",
                "total_estimated_hours": total_hours,
                "total_lessons": total_lessons,
                "total_chapters": sum(len(p["chapters"]) for p in phases),
                "difficulty_start": "Beginner" if is_beginner else "Intermediate",
                "difficulty_end": "Advanced"
            },
            "learning_objectives": [
                {"id": "lo_1", "objective": f"Understand the fundamentals of {goal}", "mastered": False},
                {"id": "lo_2", "objective": "Build practical projects applying learned concepts", "mastered": False},
                {"id": "lo_3", "objective": "Develop problem-solving skills through practice", "mastered": False},
                {"id": "lo_4", "objective": "Prepare for interviews and assessments", "mastered": False}
            ],
            "timeline_weeks": [
                {"week": i, "focus": f"Week {i} Learning", "tasks": [f"Complete assigned lessons and exercises"]}
                for i in range(1, min(weeks + 1, 53))
            ],
            "phases": phases,
            "resources": {
                "documentation": [
                    {"type": "documentation", "title": "MDN Web Docs", "url": "https://developer.mozilla.org", "description": "Comprehensive web documentation", "difficulty": "beginner", "rating": 4.8},
                    {"type": "documentation", "title": "Official Documentation", "url": "https://docs.example.com", "description": "Official documentation for your technology", "difficulty": "intermediate", "rating": 4.5}
                ],
                "videos": [
                    {"type": "video", "title": "YouTube Tutorials", "url": "https://youtube.com", "description": "Video tutorials for visual learners", "difficulty": "beginner", "rating": 4.3}
                ],
                "articles": [],
                "courses": [],
                "github": [],
                "practice": []
            },
            "revision_strategy": "Spaced repetition: Review previous topics every Sunday. Create flashcards for key concepts. Teach concepts to others to reinforce learning.",
            "interview_preparation": "Practice coding problems daily. Review system design basics. Prepare behavioral questions using the STAR method. Mock interviews every 2 weeks.",
            "final_assessment": "Complete a capstone project that demonstrates all learned skills. Pass a comprehensive assessment exam covering all phases. Present your portfolio of projects."
        }

    def _generate_fullstack_roadmap(self, weeks: int) -> List[Dict[str, Any]]:
        return [
            {
                "id": "phase_1",
                "name": "Foundation",
                "description": "Build a solid foundation in web technologies",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_1",
                        "title": "HTML & CSS Fundamentals",
                        "description": "Learn the building blocks of web pages",
                        "estimated_hours": 20,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_1",
                                "title": "Introduction to HTML",
                                "description": "Learn HTML structure, tags, and semantic elements",
                                "duration_minutes": 45,
                                "resources": [
                                    {"type": "documentation", "title": "MDN HTML Guide", "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML", "description": "Comprehensive HTML tutorial", "difficulty": "beginner", "rating": 4.8},
                                    {"type": "video", "title": "HTML Crash Course", "url": "https://youtube.com", "description": "Quick video intro to HTML", "difficulty": "beginner", "rating": 4.5}
                                ],
                                "practice_exercises": ["Create a simple HTML page", "Build a recipe page with semantic tags"],
                                "completed": False
                            },
                            {
                                "id": "lesson_2",
                                "title": "CSS Styling Basics",
                                "description": "Master CSS selectors, properties, and layouts",
                                "duration_minutes": 60,
                                "resources": [
                                    {"type": "documentation", "title": "MDN CSS Guide", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS", "description": "Complete CSS reference", "difficulty": "beginner", "rating": 4.7}
                                ],
                                "practice_exercises": ["Style a landing page", "Create a card component"],
                                "completed": False
                            },
                            {
                                "id": "lesson_3",
                                "title": "Flexbox and Grid",
                                "description": "Modern CSS layout techniques",
                                "duration_minutes": 90,
                                "resources": [
                                    {"type": "article", "title": "CSS Tricks Flexbox Guide", "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", "description": "Visual guide to Flexbox", "difficulty": "intermediate", "rating": 4.9}
                                ],
                                "practice_exercises": ["Build a responsive navigation", "Create a gallery layout"],
                                "completed": False
                            }
                        ]
                    },
                    {
                        "id": "ch_2",
                        "title": "JavaScript Essentials",
                        "description": "Master the language of the web",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_4",
                                "title": "JS Fundamentals",
                                "description": "Variables, functions, and control flow",
                                "duration_minutes": 60,
                                "resources": [
                                    {"type": "documentation", "title": "MDN JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript", "description": "Complete JS tutorial", "difficulty": "beginner", "rating": 4.8}
                                ],
                                "practice_exercises": ["Build a calculator", "Create a to-do list"],
                                "completed": False
                            },
                            {
                                "id": "lesson_5",
                                "title": "DOM Manipulation",
                                "description": "Interactive web pages with DOM",
                                "duration_minutes": 75,
                                "resources": [],
                                "practice_exercises": ["Build an accordion", "Create a modal popup"],
                                "completed": False
                            }
                        ]
                    }
                ]
            },
            {
                "id": "phase_2",
                "name": "Backend Development",
                "description": "Server-side programming and databases",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_3",
                        "title": "Node.js & Express",
                        "description": "Build RESTful APIs with Node",
                        "estimated_hours": 35,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_6",
                                "title": "Node.js Basics",
                                "description": "Server-side JavaScript runtime",
                                "duration_minutes": 60,
                                "resources": [],
                                "practice_exercises": ["Create a simple server", "Build a REST endpoint"],
                                "completed": False
                            },
                            {
                                "id": "lesson_7",
                                "title": "Express Framework",
                                "description": "Web application framework for Node.js",
                                "duration_minutes": 90,
                                "resources": [],
                                "practice_exercises": ["Build a REST API", "Implement middleware"],
                                "completed": False
                            }
                        ]
                    },
                    {
                        "id": "ch_4",
                        "title": "Databases",
                        "description": "Data persistence and management",
                        "estimated_hours": 30,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_8",
                                "title": "MongoDB Fundamentals",
                                "description": "NoSQL database concepts",
                                "duration_minutes": 60,
                                "resources": [],
                                "practice_exercises": ["Design a schema", "CRUD operations"],
                                "completed": False
                            }
                        ]
                    }
                ]
            },
            {
                "id": "phase_3",
                "name": "Frontend Frameworks",
                "description": "Modern UI development with React",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_5",
                        "title": "React Fundamentals",
                        "description": "Component-based UI development",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_9",
                                "title": "React Components & JSX",
                                "description": "Building blocks of React apps",
                                "duration_minutes": 60,
                                "resources": [],
                                "practice_exercises": ["Create a component library", "Build a dashboard UI"],
                                "completed": False
                            },
                            {
                                "id": "lesson_10",
                                "title": "State Management",
                                "description": "Managing application state",
                                "duration_minutes": 90,
                                "resources": [],
                                "practice_exercises": ["Build a shopping cart", "Create a form wizard"],
                                "completed": False
                            }
                        ]
                    }
                ]
            },
            {
                "id": "phase_4",
                "name": "Capstone",
                "description": "Build and deploy full-stack applications",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_6",
                        "title": "Full-Stack Project",
                        "description": "Apply all learned concepts",
                        "estimated_hours": 50,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_11",
                                "title": "Project Planning",
                                "description": "Design and architecture",
                                "duration_minutes": 45,
                                "resources": [],
                                "practice_exercises": ["Create project spec", "Design database schema"],
                                "completed": False
                            },
                            {
                                "id": "lesson_12",
                                "title": "Deployment",
                                "description": "Deploy to production",
                                "duration_minutes": 60,
                                "resources": [],
                                "practice_exercises": ["Deploy to Vercel", "Set up CI/CD"],
                                "completed": False
                            }
                        ]
                    }
                ]
            }
        ]

    def _generate_dsa_roadmap(self, weeks: int) -> List[Dict[str, Any]]:
        return [
            {
                "id": "phase_1",
                "name": "Foundation",
                "description": "Master basic data structures and algorithms",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_1",
                        "title": "Arrays and Strings",
                        "description": "Fundamental data structures",
                        "estimated_hours": 25,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_1",
                                "title": "Array Basics",
                                "description": "Arrays, 2D arrays, dynamic arrays",
                                "duration_minutes": 60,
                                "resources": [
                                    {"type": "practice", "title": "LeetCode Arrays", "url": "https://leetcode.com/problemset/arrays/", "description": "Practice array problems", "difficulty": "beginner", "rating": 4.8}
                                ],
                                "practice_exercises": ["Two sum", "Maximum subarray"],
                                "completed": False
                            },
                            {
                                "id": "lesson_2",
                                "title": "String Manipulation",
                                "description": "String algorithms and patterns",
                                "duration_minutes": 60,
                                "resources": [],
                                "practice_exercises": ["Reverse string", "Palindrome check"],
                                "completed": False
                            }
                        ]
                    },
                    {
                        "id": "ch_2",
                        "title": "Linked Lists",
                        "description": "Linear data structures with dynamic allocation",
                        "estimated_hours": 20,
                        "completed": False,
                        "lessons": [
                            {
                                "id": "lesson_3",
                                "title": "Singly Linked List",
                                "description": "Creation, insertion, deletion",
                                "duration_minutes": 60,
                                "resources": [],
                                "practice_exercises": ["Reverse linked list", "Detect cycle"],
                                "completed": False
                            }
                        ]
                    }
                ]
            },
            {
                "id": "phase_2",
                "name": "Core Data Structures",
                "description": "Essential data structures for problem solving",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_3",
                        "title": "Stacks and Queues",
                        "description": "LIFO and FIFO data structures",
                        "estimated_hours": 18,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_4", "title": "Stack Operations", "description": "Push, pop, peek operations", "duration_minutes": 45, "resources": [], "practice_exercises": ["Valid parentheses", "Stock span"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_4",
                        "title": "Trees",
                        "description": "Hierarchical data structures",
                        "estimated_hours": 35,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_5", "title": "Binary Trees", "description": "Binary tree traversal and operations", "duration_minutes": 75, "resources": [], "practice_exercises": ["Inorder traversal", "Level order"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_3",
                "name": "Advanced Topics",
                "description": "Complex algorithms and problem solving",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_5",
                        "title": "Graphs",
                        "description": "Graph algorithms and applications",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_6", "title": "Graph Representation", "description": "Adjacency list and matrix", "duration_minutes": 45, "resources": [], "practice_exercises": ["BFS", "DFS"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_6",
                        "title": "Dynamic Programming",
                        "description": "Optimization technique for recursive problems",
                        "estimated_hours": 45,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_7", "title": "DP Fundamentals", "description": "Memorization and tabulation", "duration_minutes": 90, "resources": [], "practice_exercises": ["Fibonacci", "Climbing stairs"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_4",
                "name": "Interview Preparation",
                "description": "Practice and ace technical interviews",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_7",
                        "title": "Problem Solving Patterns",
                        "description": "Common patterns for coding interviews",
                        "estimated_hours": 30,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_8", "title": "Two Pointers", "description": "Efficient array traversal", "duration_minutes": 45, "resources": [], "practice_exercises": ["Pair sum", "Trapping rain water"], "completed": False}
                        ]
                    }
                ]
            }
        ]

    def _generate_ai_roadmap(self, weeks: int) -> List[Dict[str, Any]]:
        return [
            {
                "id": "phase_1",
                "name": "Mathematics Foundation",
                "description": "Essential math for AI/ML",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_1",
                        "title": "Linear Algebra",
                        "description": "Vectors, matrices, and transformations",
                        "estimated_hours": 30,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_1", "title": "Vectors and Matrices", "description": "Fundamental operations", "duration_minutes": 60, "resources": [], "practice_exercises": ["Matrix multiplication", "Vector operations"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_2",
                        "title": "Statistics & Probability",
                        "description": "Statistical foundations for ML",
                        "estimated_hours": 25,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_2", "title": "Descriptive Statistics", "description": "Mean, median, variance, std dev", "duration_minutes": 45, "resources": [], "practice_exercises": ["Calculate statistics", "Distribution analysis"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_2",
                "name": "Machine Learning",
                "description": "Core ML algorithms and applications",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_3",
                        "title": "Supervised Learning",
                        "description": "Regression and classification",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_3", "title": "Linear Regression", "description": "Prediction with linear models", "duration_minutes": 60, "resources": [], "practice_exercises": ["House price prediction", "Salary estimation"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_4",
                        "title": "Neural Networks",
                        "description": "Deep learning fundamentals",
                        "estimated_hours": 45,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_4", "title": "Perceptrons", "description": "Neural network basics", "duration_minutes": 60, "resources": [], "practice_exercises": ["Build a perceptron", "Understand activation functions"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_3",
                "name": "Deep Learning",
                "description": "Advanced neural network architectures",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_5",
                        "title": "CNNs",
                        "description": "Convolutional Neural Networks for images",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_5", "title": "CNN Architecture", "description": "Convolutions, pooling, fully connected", "duration_minutes": 75, "resources": [], "practice_exercises": ["Image classification", "Object detection basics"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_4",
                "name": "LLMs & Generative AI",
                "description": "Large language models and applications",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_6",
                        "title": "Transformer Architecture",
                        "description": "Attention mechanism and transformers",
                        "estimated_hours": 50,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_6", "title": "Self-Attention", "description": "Understanding attention mechanism", "duration_minutes": 90, "resources": [], "practice_exercises": ["Implement attention", "Build a simple transformer"], "completed": False}
                        ]
                    }
                ]
            }
        ]

    def _generate_cybersecurity_roadmap(self, weeks: int) -> List[Dict[str, Any]]:
        return [
            {
                "id": "phase_1",
                "name": "Security Fundamentals",
                "description": "Basic security concepts and principles",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_1",
                        "title": "CIA Triad & Security Principles",
                        "description": "Core security concepts",
                        "estimated_hours": 15,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_1", "title": "Confidentiality, Integrity, Availability", "description": "Understanding the CIA triad", "duration_minutes": 45, "resources": [], "practice_exercises": ["Identify security controls"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_2",
                        "title": "Networking Basics",
                        "description": "Network protocols and security",
                        "estimated_hours": 30,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_2", "title": "TCP/IP Protocol Suite", "description": "Understanding network layers", "duration_minutes": 60, "resources": [], "practice_exercises": ["Packet analysis", "Port scanning"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_2",
                "name": "Offensive Security",
                "description": "Penetration testing and vulnerability assessment",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_3",
                        "title": "Ethical Hacking",
                        "description": "Legal and ethical penetration testing",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_3", "title": "Reconnaissance", "description": "Information gathering techniques", "duration_minutes": 60, "resources": [], "practice_exercises": ["OSINT", "Network enumeration"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_3",
                "name": "Defensive Security",
                "description": "Protection and incident response",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_4",
                        "title": "SIEM & Monitoring",
                        "description": "Security information and event management",
                        "estimated_hours": 30,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_4", "title": "Log Analysis", "description": "Analyzing security logs", "duration_minutes": 60, "resources": [], "practice_exercises": ["Log parsing", "Threat detection"], "completed": False}
                        ]
                    }
                ]
            }
        ]

    def _generate_react_roadmap(self, weeks: int) -> List[Dict[str, Any]]:
        return [
            {
                "id": "phase_1",
                "name": "JavaScript Deep Dive",
                "description": "Advanced JavaScript for React",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_1",
                        "title": "Modern JavaScript",
                        "description": "ES6+ features essential for React",
                        "estimated_hours": 25,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_1", "title": "ES6+ Syntax", "description": "Arrow functions, destructuring, spread", "duration_minutes": 60, "resources": [], "practice_exercises": ["Refactor legacy code", "Use modern patterns"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_2",
                "name": "React Fundamentals",
                "description": "Core React concepts",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_2",
                        "title": "Components & JSX",
                        "description": "Building blocks of React apps",
                        "estimated_hours": 35,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_2", "title": "Functional Components", "description": "Creating reusable components", "duration_minutes": 60, "resources": [], "practice_exercises": ["Build a component library", "Compose components"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_3",
                        "title": "Hooks",
                        "description": "State and side effects in functional components",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_3", "title": "useState & useEffect", "description": "Basic hooks for state management", "duration_minutes": 75, "resources": [], "practice_exercises": ["Build a counter app", "Create a data fetching hook"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_3",
                "name": "Advanced React",
                "description": "Performance and patterns",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_4",
                        "title": "State Management",
                        "description": "Global state with Context and Redux",
                        "estimated_hours": 35,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_4", "title": "React Context", "description": "Sharing state across components", "duration_minutes": 60, "resources": [], "practice_exercises": ["Build a theme provider", "Create auth context"], "completed": False}
                        ]
                    }
                ]
            }
        ]

    def _generate_gate_cse_roadmap(self, weeks: int) -> List[Dict[str, Any]]:
        return [
            {
                "id": "phase_1",
                "name": "Programming Fundamentals",
                "description": "C programming and basic data structures",
                "estimated_weeks": weeks // 5,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_1",
                        "title": "C Programming",
                        "description": "C language fundamentals",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_1", "title": "Basics & Control Flow", "description": "Variables, loops, conditionals", "duration_minutes": 60, "resources": [], "practice_exercises": ["Pattern printing", "Number programs"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_2",
                        "title": "Data Structures",
                        "description": "Linear and non-linear data structures",
                        "estimated_hours": 50,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_2", "title": "Arrays & Linked Lists", "description": "Sequential and linked storage", "duration_minutes": 75, "resources": [], "practice_exercises": ["Implement all operations", "Solve GATE problems"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_2",
                "name": "Theory Subjects",
                "description": "Core computer science theory",
                "estimated_weeks": weeks // 5,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_3",
                        "title": "Discrete Mathematics",
                        "description": "Mathematical foundations",
                        "estimated_hours": 35,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_3", "title": "Set Theory & Logic", "description": "Propositional and predicate logic", "duration_minutes": 60, "resources": [], "practice_exercises": ["Prove theorems", "Solve logic problems"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_4",
                        "title": "Algorithms",
                        "description": "Algorithm design and analysis",
                        "estimated_hours": 45,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_4", "title": "Algorithm Analysis", "description": "Time and space complexity", "duration_minutes": 60, "resources": [], "practice_exercises": ["Analyze algorithms", "Solve recurrence relations"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_3",
                "name": "Core Subjects",
                "description": "Operating systems, DBMS, Networks",
                "estimated_weeks": weeks // 5,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_5",
                        "title": "Operating Systems",
                        "description": "OS concepts and principles",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_5", "title": "Process Management", "description": "Scheduling, synchronization", "duration_minutes": 75, "resources": [], "practice_exercises": ["Solve GATE OS problems"], "completed": False}
                        ]
                    },
                    {
                        "id": "ch_6",
                        "title": "Database Systems",
                        "description": "DBMS fundamentals",
                        "estimated_hours": 35,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_6", "title": "SQL & Normalization", "description": "Database design and queries", "duration_minutes": 60, "resources": [], "practice_exercises": ["Write complex queries", "Design normalized schemas"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_4",
                "name": "Computer Networks",
                "description": "Networking fundamentals",
                "estimated_weeks": weeks // 5,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_7",
                        "title": "Network Layers",
                        "description": "OSI and TCP/IP models",
                        "estimated_hours": 30,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_7", "title": "Application & Transport Layer", "description": "HTTP, TCP, UDP", "duration_minutes": 60, "resources": [], "practice_exercises": ["Socket programming", "Protocol analysis"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_5",
                "name": "Revision & Practice",
                "description": "Previous year papers and mock tests",
                "estimated_weeks": weeks // 5,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_8",
                        "title": "Problem Solving",
                        "description": "GATE-style questions",
                        "estimated_hours": 50,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_8", "title": "Previous Year Papers", "description": "Solve GATE CSE papers", "duration_minutes": 180, "resources": [], "practice_exercises": ["Complete 3-hour mock tests"], "completed": False}
                        ]
                    }
                ]
            }
        ]

    def _generate_programming_roadmap(self, weeks: int, goal: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": "phase_1",
                "name": "Getting Started",
                "description": "Set up your development environment",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_1",
                        "title": "Introduction",
                        "description": f"Introduction to {goal}",
                        "estimated_hours": 15,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_1", "title": "What is " + goal + "?", "description": "Overview and applications", "duration_minutes": 30, "resources": [], "practice_exercises": ["Research applications"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_2",
                "name": "Core Concepts",
                "description": "Fundamental topics",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_2",
                        "title": "Fundamentals",
                        "description": "Core principles",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_2", "title": "Basic Concepts", "description": "Key terminology and concepts", "duration_minutes": 60, "resources": [], "practice_exercises": ["Complete exercises"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_3",
                "name": "Building Skills",
                "description": "Hands-on practice",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_3",
                        "title": "Practice",
                        "description": "Apply what you've learned",
                        "estimated_hours": 35,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_3", "title": "Project Work", "description": "Build something real", "duration_minutes": 90, "resources": [], "practice_exercises": ["Complete a mini project"], "completed": False}
                        ]
                    }
                ]
            },
            {
                "id": "phase_4",
                "name": "Mastery",
                "description": "Advanced topics and portfolio",
                "estimated_weeks": weeks // 4,
                "completed": False,
                "chapters": [
                    {
                        "id": "ch_4",
                        "title": "Advanced Topics",
                        "description": "Expert-level concepts",
                        "estimated_hours": 40,
                        "completed": False,
                        "lessons": [
                            {"id": "lesson_4", "title": "Expert Concepts", "description": "Master advanced topics", "duration_minutes": 90, "resources": [], "practice_exercises": ["Build an advanced project"], "completed": False}
                        ]
                    }
                ]
            }
        ]

    async def generate_chat_response(
        self,
        roadmap_context: Dict[str, Any],
        user_message: str
    ) -> Dict[str, Any]:
        prompt = f"""You are an AI mentor helping a student following this learning roadmap:

Goal: {roadmap_context.get('goal', 'Learning')}
Current Progress: {roadmap_context.get('progress', 'Just started')}

The student asks: {user_message}

Provide a helpful, educational response that:
1. Answers their question directly
2. References their roadmap/learning context when relevant
3. Suggests next steps or resources
4. Encourages them in their learning journey

Keep responses concise but informative (2-4 paragraphs max).
If asking what to learn next, reference their roadmap phases and chapters.
"""

        if self.model:
            try:
                response = self.model.generate_content(prompt)
                reply = response.text
            except Exception as e:
                reply = f"I'd be happy to help with your learning journey! Regarding your question about {user_message[:50]}... - could you tell me more about what specific aspect you'd like to explore? Based on your roadmap, we can identify the best resources and next steps."
        else:
            reply = f"Great question about {user_message[:50]}! Based on your learning journey, I'd recommend reviewing the relevant chapter in your roadmap and practicing with hands-on exercises. Would you like me to suggest specific resources from your roadmap?"

        suggestions = [
            "What should I learn next?",
            "Can you explain this topic in simpler terms?",
            "Give me some practice exercises",
            "How does this connect to what I learned before?"
        ]

        return {
            "reply": reply,
            "suggestions": suggestions
        }

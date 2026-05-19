import type { Roadmap } from '@/types'

export const SAMPLE_ROADMAPS: Roadmap[] = [
  {
    id: 'sample-fullstack-dev',
    goal: 'Full Stack Web Developer',
    skill_level: 'beginner',
    daily_hours: 3,
    learning_style: 'active',
    target_months: 6,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    generated_roadmap: {
      overview: {
        title: 'Full Stack Web Developer Roadmap',
        description: 'A comprehensive path from HTML/CSS basics to advanced full-stack application development, covering modern front-end frameworks, RESTful APIs, databases, and deployment.',
        total_estimated_hours: 360,
        total_lessons: 12,
        total_chapters: 4,
        difficulty_start: 'Beginner',
        difficulty_end: 'Intermediate'
      },
      learning_objectives: [
        { id: 'lo-1', objective: 'Understand core Web architecture and HTTP protocols', mastered: false },
        { id: 'lo-2', objective: 'Build responsive interfaces using HTML5, CSS3, and Tailwind CSS', mastered: false },
        { id: 'lo-3', objective: 'Program with JavaScript (ES6+) and handle asynchronous tasks', mastered: false },
        { id: 'lo-4', objective: 'Build interactive frontends using React and Next.js', mastered: false },
        { id: 'lo-5', objective: 'Create REST APIs with Node.js and Express', mastered: false },
        { id: 'lo-6', objective: 'Integrate PostgreSQL and MongoDB databases with applications', mastered: false }
      ],
      timeline_weeks: [
        { week: 1, focus: 'Frontend Foundations (HTML & CSS)', tasks: ['Learn semantic HTML tags', 'Understand CSS Box Model & Flexbox', 'Build a responsive landing page'] },
        { week: 4, focus: 'JavaScript Programming', tasks: ['Master DOM manipulation', 'Understand Promises and Fetch API', 'Build a weather dashboard app'] },
        { week: 10, focus: 'React & Next.js Frameworks', tasks: ['Understand components, state, and props', 'Implement client-side routing', 'Deploy a frontend app to Vercel'] },
        { week: 18, focus: 'Backend Development & Databases', tasks: ['Create an Express server', 'Design a relational database schema', 'Connect backend to a frontend'] }
      ],
      phases: [
        {
          id: 'phase-1',
          name: 'Front-End Mastery',
          description: 'Master the user-facing side of the web, developing styling, layout, interactivity, and framework development skills.',
          estimated_weeks: 12,
          completed: false,
          chapters: [
            {
              id: 'ch-1',
              title: 'Core Styles and Interactivity',
              description: 'HTML5, modern CSS layouts (Flexbox/Grid), and intermediate JavaScript variables and functions.',
              estimated_hours: 60,
              completed: false,
              lessons: [
                {
                  id: 'ls-1',
                  title: 'Semantic HTML & Layout Systems',
                  description: 'Learn how to structure pages cleanly and lay out elements beautifully using Flexbox and Grid.',
                  duration_minutes: 90,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'MDN CSS Layout Guide',
                      url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout',
                      description: 'The absolute authority on CSS layouts.',
                      difficulty: 'beginner',
                      rating: 4.9
                    },
                    {
                      type: 'video',
                      title: 'Flexbox in 15 Minutes',
                      url: 'https://www.youtube.com/watch?v=JJSoGo8DGpx',
                      description: 'Visual breakdown of Flexbox alignment properties.',
                      difficulty: 'beginner',
                      rating: 4.8
                    }
                  ],
                  practice_exercises: [
                    'Re-create the layout of your favorite website using CSS Grid.',
                    'Solve the Flexbox Froggy educational game levels 1-24.'
                  ]
                },
                {
                  id: 'ls-2',
                  title: 'Modern JavaScript (ES6+)',
                  description: 'Learn arrow functions, destructuring, modules, and asynchronous programming with async/await.',
                  duration_minutes: 120,
                  completed: false,
                  resources: [
                    {
                      type: 'article',
                      title: 'ES6 Syntax Guide',
                      url: 'https://javascript.info/es-features',
                      description: 'Clear examples of modern JavaScript enhancements.',
                      difficulty: 'beginner',
                      rating: 4.7
                    }
                  ],
                  practice_exercises: [
                    'Write a fetch function that gathers posts from a public test API.',
                    'Convert old ES5 functions into modern arrow functions.'
                  ]
                }
              ]
            },
            {
              id: 'ch-2',
              title: 'React Components & Architecture',
              description: 'Transition into single-page application development using React hook states and client-side rendering.',
              estimated_hours: 80,
              completed: false,
              lessons: [
                {
                  id: 'ls-3',
                  title: 'React State Management (Hooks)',
                  description: 'Understand the lifecycle of a component, useState, and useEffect side-effects.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'React Dev Docs - Thinking in React',
                      url: 'https://react.dev/learn/thinking-in-react',
                      description: 'Official introduction to state flow.',
                      difficulty: 'intermediate',
                      rating: 5.0
                    }
                  ],
                  practice_exercises: [
                    'Build a responsive To-Do List app with filter options.',
                    'Create a stopwatch component using useEffect.'
                  ]
                },
                {
                  id: 'ls-4',
                  title: 'Next.js Router & SSR',
                  description: 'Utilize Next.js App Router, file-based routing, and Server Side Rendering vs Client Component options.',
                  duration_minutes: 150,
                  completed: false,
                  resources: [
                    {
                      type: 'course',
                      title: 'Next.js Official Learn Platform',
                      url: 'https://nextjs.org/learn',
                      description: 'Comprehensive guided course by Vercel creators.',
                      difficulty: 'intermediate',
                      rating: 4.9
                    }
                  ],
                  practice_exercises: [
                    'Create a dynamic route `/blog/[slug]` that displays blog pages.',
                    'Fetch initial dummy API data inside a Server Component.'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Back-End & Database Engineering',
          description: 'Establish server infrastructure, design databases, and write secure back-end API endpoints.',
          estimated_weeks: 12,
          completed: false,
          chapters: [
            {
              id: 'ch-3',
              title: 'Server-Side Programming with Express',
              description: 'Write HTTP servers, create route handlers, and process JSON payloads.',
              estimated_hours: 100,
              completed: false,
              lessons: [
                {
                  id: 'ls-5',
                  title: 'Building Rest APIs',
                  description: 'Establish clean REST endpoints, parse query queries, and build router groups.',
                  duration_minutes: 120,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'ExpressJS Getting Started',
                      url: 'https://expressjs.com/en/starter/hello-world.html',
                      description: 'Quick start guides for Express developers.',
                      difficulty: 'intermediate',
                      rating: 4.6
                    }
                  ],
                  practice_exercises: [
                    'Create a simple CRUD API for managing a books inventory.',
                    'Write a custom middleware function that logs the path of each HTTP request.'
                  ]
                },
                {
                  id: 'ls-6',
                  title: 'JWT Authentication & Security',
                  description: 'Authenticate requests using JSON Web Tokens (JWT) and secure headers.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'article',
                      title: 'Node.js JWT Guide',
                      url: 'https://jwt.io/introduction/',
                      description: 'A detailed breakdown of header, payload, and signature components.',
                      difficulty: 'intermediate',
                      rating: 4.8
                    }
                  ],
                  practice_exercises: [
                    'Implement password hashing using bcrypt before saving users.',
                    'Protect route path endpoints so only authenticated clients can fetch data.'
                  ]
                }
              ]
            },
            {
              id: 'ch-4',
              title: 'Database Integrations & Deployment',
              description: 'Model data in Relational (PostgreSQL) and Document-based (MongoDB) stores, and host production systems.',
              estimated_hours: 120,
              completed: false,
              lessons: [
                {
                  id: 'ls-7',
                  title: 'Database Schema Design',
                  description: 'Write SQL queries, join tables, use ORMs (Prisma or Mongoose), and handle transactions.',
                  duration_minutes: 200,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'Prisma Quickstart Guide',
                      url: 'https://www.prisma.io/docs/getting-started',
                      description: 'Learn schema definition and migration basics.',
                      difficulty: 'intermediate',
                      rating: 4.9
                    }
                  ],
                  practice_exercises: [
                    'Design a database schema for an e-commerce platform with Users, Orders, and Items.',
                    'Perform relational migrations locally using PostgreSQL.'
                  ]
                },
                {
                  id: 'ls-8',
                  title: 'Production Deployments & Cloud',
                  description: 'Deploy full-stack code to platforms like Render, AWS, or Docker containers.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'video',
                      title: 'Dockerizing Node.js Apps',
                      url: 'https://www.youtube.com/watch?v=gAkwW2tuIqE',
                      description: 'Step by step container construction.',
                      difficulty: 'advanced',
                      rating: 4.7
                    }
                  ],
                  practice_exercises: [
                    'Create a Dockerfile to package your node server application.',
                    'Deploy a fully functioning web server connected to a cloud database.'
                  ]
                }
              ]
            }
          ]
        }
      ],
      resources: {},
      revision_strategy: 'Weekly repetition: Implement the concept in code immediately. Revisit previous weeks tasks every Friday to refactor files.',
      interview_preparation: 'Practice 3 medium-level system design topics. Focus heavily on REST principles, database indexes, and React state optimizations.',
      final_assessment: 'Construct a multi-user blog application featuring real-time comments, category search indexing, and secure login dashboard screens.'
    }
  },
  {
    id: 'sample-ml-engineer',
    goal: 'Machine Learning Engineer',
    skill_level: 'intermediate',
    daily_hours: 3,
    learning_style: 'reading',
    target_months: 12,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    generated_roadmap: {
      overview: {
        title: 'Machine Learning Engineer Roadmap',
        description: 'Bridge the gap between software engineering and mathematics. Master data analysis, classical ML algorithms, Deep Learning models, and production-grade MLOps deployment.',
        total_estimated_hours: 720,
        total_lessons: 12,
        total_chapters: 4,
        difficulty_start: 'Intermediate',
        difficulty_end: 'Advanced'
      },
      learning_objectives: [
        { id: 'ml-lo-1', objective: 'Master Python libraries: NumPy, Pandas, Scikit-Learn', mastered: false },
        { id: 'ml-lo-2', objective: 'Perform advanced exploratory data analysis and feature engineering', mastered: false },
        { id: 'ml-lo-3', objective: 'Implement regression, classification, clustering, and SVM algorithms', mastered: false },
        { id: 'ml-lo-4', objective: 'Build and tune Deep Neural Networks using PyTorch or TensorFlow', mastered: false },
        { id: 'ml-lo-5', objective: 'Build recommendation systems and NLP text transformers', mastered: false },
        { id: 'ml-lo-6', objective: 'Deploy ML models via REST APIs and monitor drift in production', mastered: false }
      ],
      timeline_weeks: [
        { week: 1, focus: 'Math Foundations & Python Libraries', tasks: ['Review Linear Algebra & Probability', 'Practice Pandas operations', 'Perform data visualization'] },
        { week: 8, focus: 'Classical Machine Learning', tasks: ['Understand bias-variance tradeoff', 'Apply Scikit-Learn classifiers', 'Use cross-validation metrics'] },
        { week: 24, focus: 'Deep Learning & Neural Networks', tasks: ['Write multi-layer perceptron in PyTorch', 'Build Convolutional Networks for images', 'Fine-tune an NLP Transformer'] },
        { week: 40, focus: 'MLOps & Deployment', tasks: ['Dockerize models with FastAPI', 'Configure model monitoring pipelines', 'Use Triton or ONNX for fast inference'] }
      ],
      phases: [
        {
          id: 'ml-phase-1',
          name: 'Foundations & Classical ML',
          description: 'Build mathematical foundations and master classical machine learning models for structural tabular datasets.',
          estimated_weeks: 24,
          completed: false,
          chapters: [
            {
              id: 'ml-ch-1',
              title: 'Data Science Toolkit & Math',
              description: 'Linear algebra, statistics, calculus, and standard data preparation libraries.',
              estimated_hours: 150,
              completed: false,
              lessons: [
                {
                  id: 'ml-ls-1',
                  title: 'Vector Math & Statistics',
                  description: 'Understand matrix transformations, eigenvalues, probability distributions, and hypothesis tests.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'NumPy Linear Algebra Reference',
                      url: 'https://numpy.org/doc/stable/reference/routines.linalg.html',
                      description: 'Overview of standard matrix computations in python.',
                      difficulty: 'intermediate',
                      rating: 4.8
                    }
                  ],
                  practice_exercises: [
                    'Write a custom matrix multiplication script using pure Python.',
                    'Solve 15 statistical exercises covering Normal and Binomial distributions.'
                  ]
                },
                {
                  id: 'ml-ls-2',
                  title: 'Pandas & EDA Data Pipelines',
                  description: 'Analyze, filter, clean, and format raw records using pandas and seaborn visualization.',
                  duration_minutes: 120,
                  completed: false,
                  resources: [
                    {
                      type: 'article',
                      title: 'EDA Best Practices Guide',
                      url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
                      description: 'A 10-minute guide to mastering pandas basics.',
                      difficulty: 'beginner',
                      rating: 4.7
                    }
                  ],
                  practice_exercises: [
                    'Clean a messy Kaggle dataset by replacing missing values and outliers.',
                    'Create a correlation heatmap indicating feature importances.'
                  ]
                }
              ]
            },
            {
              id: 'ml-ch-2',
              title: 'Supervised & Unsupervised Learning',
              description: 'Train models, fine-tune hyperparameters, and interpret performance logs.',
              estimated_hours: 210,
              completed: false,
              lessons: [
                {
                  id: 'ml-ls-3',
                  title: 'Regression & Decision Trees',
                  description: 'Implement Ridge, Lasso, Random Forests, and XGBoost models for predictions.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'course',
                      title: 'Stanford Machine Learning Specialization',
                      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
                      description: 'Andrew Ng\'s core introductory concepts.',
                      difficulty: 'intermediate',
                      rating: 5.0
                    }
                  ],
                  practice_exercises: [
                    'Train a model forecasting house prices using Scikit-Learn.',
                    'Compare decision trees vs Gradient Boosted models for accuracy.'
                  ]
                },
                {
                  id: 'ml-ls-4',
                  title: 'Clustering & Dimensionality Reduction',
                  description: 'Group data using K-Means, DBSCAN, and project features down using PCA.',
                  duration_minutes: 150,
                  completed: false,
                  resources: [
                    {
                      type: 'video',
                      title: 'StatQuest: PCA Explained Visually',
                      url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ',
                      description: 'Engaging explanation of principal component projections.',
                      difficulty: 'intermediate',
                      rating: 4.9
                    }
                  ],
                  practice_exercises: [
                    'Reduce a dataset with 50 features down to 2 components using PCA.',
                    'Classify customers into segments using K-Means clustering.'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'ml-phase-2',
          name: 'Deep Learning & Production MLOps',
          description: 'Build neural models for unstructured datasets and deploy predictive systems to cloud API hubs.',
          estimated_weeks: 24,
          completed: false,
          chapters: [
            {
              id: 'ml-ch-3',
              title: 'Deep Neural Networks & NLP',
              description: 'Implement backpropagation, convolution layers, sequence models, and attention mechanisms.',
              estimated_hours: 200,
              completed: false,
              lessons: [
                {
                  id: 'ml-ls-5',
                  title: 'PyTorch Deep Learning Core',
                  description: 'Implement custom datasets, feedforward layers, optimizers, and loss functions in PyTorch.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'PyTorch Tutorials',
                      url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
                      description: 'Official PyTorch learning sequence.',
                      difficulty: 'intermediate',
                      rating: 4.9
                    }
                  ],
                  practice_exercises: [
                    'Build an image classification neural network for the MNIST digits dataset.',
                    'Implement a custom training loop featuring learning rate schedules.'
                  ]
                },
                {
                  id: 'ml-ls-6',
                  title: 'Transformers & Large Language Models',
                  description: 'Learn attention layers, tokenization, and fine-tuning BERT or GPT-style parameters using HuggingFace.',
                  duration_minutes: 240,
                  completed: false,
                  resources: [
                    {
                      type: 'article',
                      title: 'The Illustrated Transformer',
                      url: 'https://jalammar.github.io/illustrated-transformer/',
                      description: 'Visualizing self-attention components in detail.',
                      difficulty: 'advanced',
                      rating: 4.9
                    }
                  ],
                  practice_exercises: [
                    'Fine-tune an NLP model to classify customer support emails.',
                    'Create an autocomplete engine utilizing a small language model.'
                  ]
                }
              ]
            },
            {
              id: 'ml-ch-4',
              title: 'Deploying & Scaling Models',
              description: 'Package, release, monitor, and host machine learning microservices.',
              estimated_hours: 160,
              completed: false,
              lessons: [
                {
                  id: 'ml-ls-7',
                  title: 'FastAPI Microservice APIs',
                  description: 'Wrap your python models in REST endpoints, cache responses, and parse user payloads.',
                  duration_minutes: 120,
                  completed: false,
                  resources: [
                    {
                      type: 'video',
                      title: 'Deploying ML Models as APIs',
                      url: 'https://www.youtube.com/watch?v=h5wLuVJyDhc',
                      description: 'Step by step FastAPI integration with scikit-learn.',
                      difficulty: 'intermediate',
                      rating: 4.8
                    }
                  ],
                  practice_exercises: [
                    'Build a server endpoint `/predict` which processes a text string and returns a classification.',
                    'Write load tests using Locust to see requests per second limits.'
                  ]
                },
                {
                  id: 'ml-ls-8',
                  title: 'Model Tracking & MLOps Tools',
                  description: 'Track experiments using MLflow, package containers, and set up continuous training.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'MLflow Documentation',
                      url: 'https://mlflow.org/docs/latest/index.html',
                      description: 'Track metrics, parameters, and outputs easily.',
                      difficulty: 'advanced',
                      rating: 4.7
                    }
                  ],
                  practice_exercises: [
                    'Track model parameters and accuracy across 10 distinct hyperparameter runs.',
                    'Deploy a model container utilizing automated GitHub Actions pipelines.'
                  ]
                }
              ]
            }
          ]
        }
      ],
      resources: {},
      revision_strategy: 'Implement paper readouts: Read one modern machine learning paper every two weeks and attempt to build a minimal version.',
      interview_preparation: 'Review core algorithms mathematical proofs (e.g. Backpropagation, SVM dual formulations). Solve 20 probability problems.',
      final_assessment: 'Train a Transformer model, package it as a Docker service, deploy it to AWS, and log prediction quality metrics.'
    }
  },
  {
    id: 'sample-dsa-cracking',
    goal: 'Data Structures & Algorithms',
    skill_level: 'advanced',
    daily_hours: 2,
    learning_style: 'visual',
    target_months: 3,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    generated_roadmap: {
      overview: {
        title: 'Data Structures & Algorithms (DSA) Roadmap',
        description: 'Accelerated study plan focusing on top patterns for coding interviews, including recursion, graph algorithms, dynamic programming, and system optimization.',
        total_estimated_hours: 180,
        total_lessons: 12,
        total_chapters: 3,
        difficulty_start: 'Intermediate',
        difficulty_end: 'Advanced'
      },
      learning_objectives: [
        { id: 'dsa-lo-1', objective: 'Master core linear data structures: Arrays, Linked Lists, Stacks, Queues', mastered: false },
        { id: 'dsa-lo-2', objective: 'Implement binary search and sorting algorithms efficiently', mastered: false },
        { id: 'dsa-lo-3', objective: 'Solve tree and graph problems using BFS and DFS traversals', mastered: false },
        { id: 'dsa-lo-4', objective: 'Understand common coding patterns (Sliding Window, Two Pointers)', mastered: false },
        { id: 'dsa-lo-5', objective: 'Master Dynamic Programming optimization techniques', mastered: false },
        { id: 'dsa-lo-6', objective: 'Perform Big-O space and time complexity analysis', mastered: false }
      ],
      timeline_weeks: [
        { week: 1, focus: 'Linear Data Structures & Sorting', tasks: ['Review Arrays and Linked Lists operations', 'Understand Big O notation', 'Practice binary search'] },
        { week: 4, focus: 'Trees, Graphs & Traversals', tasks: ['Master Binary Search Tree operations', 'Understand BFS and DFS algorithms', 'Solve cycle detection in graphs'] },
        { week: 9, focus: 'Dynamic Programming & Patterns', tasks: ['Understand memoization vs tabulation', 'Solve knapsack and grid problems', 'Practice 20 medium coding problems'] }
      ],
      phases: [
        {
          id: 'dsa-phase-1',
          name: 'DSA and Coding Interview Prep',
          description: 'Master advanced graph structures, design trees, solve greedy optimizations, and write memoized functions.',
          estimated_weeks: 12,
          completed: false,
          chapters: [
            {
              id: 'dsa-ch-1',
              title: 'Linear Data Structures & Searching',
              description: 'Time complexity metrics, searching, pointers, sliding windows, and list node modifications.',
              estimated_hours: 50,
              completed: false,
              lessons: [
                {
                  id: 'dsa-ls-1',
                  title: 'Two Pointers & Sliding Window',
                  description: 'Learn pointer modifications to process arrays in linear O(N) time without nested loops.',
                  duration_minutes: 90,
                  completed: false,
                  resources: [
                    {
                      type: 'article',
                      title: 'LeetCode Pattern: Sliding Window',
                      url: 'https://leetcode.com/discuss/general-discussion/1122776/sliding-window-questions-in-one-place',
                      description: 'List of standard sliding window coding prompts.',
                      difficulty: 'intermediate',
                      rating: 4.8
                    }
                  ],
                  practice_exercises: [
                    'Solve "3Sum" problem on LeetCode using two pointers.',
                    'Solve "Longest Substring Without Repeating Characters".'
                  ]
                },
                {
                  id: 'dsa-ls-2',
                  title: 'Linked List Reversals & Cycles',
                  description: 'Reverse single lists, detect node cycles using Floyd\'s algorithm, and merge lists.',
                  duration_minutes: 120,
                  completed: false,
                  resources: [
                    {
                      type: 'video',
                      title: 'Linked List Cycle Detection Explained',
                      url: 'https://www.youtube.com/watch?v=gBTe7lFR3vc',
                      description: 'Tortoise and Hare pointer mechanics.',
                      difficulty: 'intermediate',
                      rating: 4.7
                    }
                  ],
                  practice_exercises: [
                    'Write a recursive function to reverse a linked list.',
                    'Find the entry point of a loop inside a linked list.'
                  ]
                }
              ]
            },
            {
              id: 'dsa-ch-2',
              title: 'Trees, Graphs & Pathfinding',
              description: 'Traverse structures recursively, inspect nodes, calculate heights, and run Dijkstra pathfinding.',
              estimated_hours: 60,
              completed: false,
              lessons: [
                {
                  id: 'dsa-ls-3',
                  title: 'Binary Tree BFS & DFS',
                  description: 'Pre-order, in-order, post-order, and level-order traversal algorithms.',
                  duration_minutes: 150,
                  completed: false,
                  resources: [
                    {
                      type: 'documentation',
                      title: 'Binary Trees Traversals Reference',
                      url: 'https://en.wikipedia.org/wiki/Tree_traversal',
                      description: 'Overview of standard tree traversals.',
                      difficulty: 'intermediate',
                      rating: 4.5
                    }
                  ],
                  practice_exercises: [
                    'Compute the maximum depth of a binary tree.',
                    'Determine if a binary tree is symmetric.'
                  ]
                },
                {
                  id: 'dsa-ls-4',
                  title: 'Graph Traversals (BFS/DFS)',
                  description: 'Model graphs with adjacency lists, identify connected components, and find shortest paths.',
                  duration_minutes: 180,
                  completed: false,
                  resources: [
                    {
                      type: 'video',
                      title: 'Graph Algorithms Course',
                      url: 'https://www.youtube.com/watch?v=tWVWeQqKlHY',
                      description: 'Visual walk-through of graph algorithms.',
                      difficulty: 'advanced',
                      rating: 4.9
                    }
                  ],
                  practice_exercises: [
                    'Implement Breadth-First Search to solve a maze grid.',
                    'Check for cycles in a directed graph using DFS.'
                  ]
                }
              ]
            },
            {
              id: 'dsa-ch-3',
              title: 'Dynamic Programming & Memoization',
              description: 'Convert exponential recursive algorithms into linear time solutions by storing duplicate computations.',
              estimated_hours: 70,
              completed: false,
              lessons: [
                {
                  id: 'dsa-ls-5',
                  title: '1D & 2D Dynamic Programming',
                  description: 'Understand top-down memoization, bottom-up tabulations, and solving grid path counts.',
                  duration_minutes: 200,
                  completed: false,
                  resources: [
                    {
                      type: 'course',
                      title: 'Dynamic Programming for Interviews',
                      url: 'https://www.youtube.com/watch?v=oBt53YbR9K0',
                      description: 'Comprehensive DP breakdown.',
                      difficulty: 'advanced',
                      rating: 5.0
                    }
                  ],
                  practice_exercises: [
                    'Solve the "Climbing Stairs" problem using Dynamic Programming.',
                    'Compute the minimum path sum in a 2D grid.'
                  ]
                },
                {
                  id: 'dsa-ls-6',
                  title: 'Knapsack Problem Variations',
                  description: 'Solve subset sum, coin changes, and knapsack optimizations using tabular matrices.',
                  duration_minutes: 220,
                  completed: false,
                  resources: [
                    {
                      type: 'article',
                      title: 'Demystifying the Knapsack Problem',
                      url: 'https://medium.com/@fabianterh/demystifying-the-0-1-knapsack-problem-cb97a228f402',
                      description: 'Matrix representations explained clearly.',
                      difficulty: 'advanced',
                      rating: 4.8
                    }
                  ],
                  practice_exercises: [
                    'Implement the Coin Change problem (number of combinations).',
                    'Solve the classic 0-1 Knapsack problem.'
                  ]
                }
              ]
            }
          ]
        }
      ],
      resources: {},
      revision_strategy: 'Complete 3 coding problems every day. Track patterns (e.g. hash maps, backtracking) rather than individual solutions.',
      interview_preparation: 'Practice mock interview runs. Talk out loud while coding on a blank screen or whiteboard.',
      final_assessment: 'Perform a timed coding assessment solving 3 questions (easy, medium, hard) in under 90 minutes.'
    }
  }
]

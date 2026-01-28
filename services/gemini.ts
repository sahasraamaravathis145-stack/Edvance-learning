
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Roadmap, AssessmentQuestion } from "../types";

export const generateAssessment = async (skill: string, level: string): Promise<AssessmentQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 multiple-choice questions to assess proficiency in "${skill}" for a "${level}" level. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of correct option" },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const generateRoadmap = async (profile: UserProfile, score: number): Promise<Roadmap> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Create a learning roadmap for ${profile.targetSkill}. 
    User current level: ${profile.proficiencyLevel}. 
    Assessment score: ${score}/100. 
    Time available: ${profile.timeAvailability} hours/week. 
    Learning style: ${profile.learningStyle}. 
    Provide 5-7 structured levels. Each level should have 3-5 concepts. 
    Crucially, for EACH level, design a small, achievable 'Project Milestone' that demonstrates mastery of that level's concepts. 
    The project should include: title, specific requirements, common challenges, and how an AI tutor can assist.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          skill: { type: Type.STRING },
          levels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                status: { type: Type.STRING, enum: ["locked", "unlocked", "completed", "in_progress"] },
                estimatedTime: { type: Type.STRING },
                project: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tutorRole: { type: Type.STRING }
                  },
                  required: ["title", "requirements", "challenges", "tutorRole"]
                }
              },
              required: ["id", "title", "description", "concepts", "status", "estimatedTime", "project"]
            }
          }
        },
        required: ["id", "skill", "levels"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getTutorResponse = async (level: any, context: string, userMessage: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Edvance AI, a personal tutor specializing in ${level.title}. 
      Current Focus: ${context}. 
      Explain concepts clearly, use the Socratic method, and provide code/examples if helpful. 
      Encourage hands-on project completion.`
    }
  });
  
  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};

export const getSupportResponse = async (userMessage: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Edvance Elite Support Assistant. Your persona is highly professional, empathetic, and exceptionally clear. 
      Your goal is to guide users through the Edvance ecosystem with expert precision.

      PLATFORM ARCHITECTURE:
      - Edvance uses Gemini 3 Pro/Flash to synthesize bespoke learning paths.
      - Core Loop: Skill Input -> Baseline Assessment -> Dynamic Roadmap -> AI Tutoring -> Project Milestones -> Adaptive Quizzes.
      - Progress Tracking: Real-time mastery percentages, streak tracking, and concept-level strength analysis.
      - Date Context: The platform is operating in 2026.
      - Support Contact: edvance.contact.edu.in@gmail.com

      RESPONSE GUIDELINES:
      - Use Markdown for structure. Use **bold** for key terms and bullet points for lists.
      - If a user asks a technical question about the site, explain the feature logically.
      - If they are frustrated, acknowledge it and provide a direct solution.
      - Keep responses focused but highly informative.`
    }
  });
  
  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};

export const getIndustryExpertAdvice = async (skill: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `What are the most recent industry trends and expert advice for someone mastering ${skill} in 2026? Provide 3 specific actionable tips and extract real-world URLs for further reading.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    urls: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean) || []
  };
};

export const getCareerHubData = async (roadmap: Roadmap, profile: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const completedCount = roadmap.levels.filter(l => l.status === 'completed').length;
  const prompt = `Based on a learner who has completed ${completedCount} modules out of ${roadmap.levels.length} in ${roadmap.skill} (Current Level: ${profile.proficiencyLevel}), 
  suggest 3 job roles they should aim for. 
  For each role, provide: 
  1. Role Title
  2. Estimated Salary Range (2026)
  3. Key skills still missing from their roadmap.
  4. Real-world job boards or articles links using search.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  return {
    analysis: response.text,
    links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean) || []
  };
};

export const generateQuizForLevel = async (level: any): Promise<AssessmentQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a 5-question quiz for "${level.title}". Concepts covered: ${level.concepts.join(', ')}. Include scenario-based questions about the level project: ${level.project?.title || 'the current module'}.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const generateWeeklySummary = async (roadmap: Roadmap, streak: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const completedCount = roadmap.levels.filter(l => l.status === 'completed').length;
  const inProgress = roadmap.levels.find(l => l.status === 'in_progress')?.title || 'N/A';
  
  const prompt = `Provide a concise, motivating, and highly insightful 2-3 sentence 'Weekly Summary' for a learner. 
  Context:
  - Skill: ${roadmap.skill}
  - Levels Completed: ${completedCount} out of ${roadmap.levels.length}
  - Current Level: ${inProgress}
  - Daily Streak: ${streak} days
  
  Style: Encouraging but data-driven. Focus on practical growth.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  
  return response.text || "You're making steady progress. Keep focusing on your project milestones to solidify your learning.";
};

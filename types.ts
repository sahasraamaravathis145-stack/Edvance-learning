
export interface UserProfile {
  name: string;
  targetSkill: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  timeAvailability: number; // hours per week
  learningStyle: 'visual' | 'hands-on' | 'theoretical';
  onboarded: boolean;
  isPro?: boolean;
}

export interface ProjectModule {
  title: string;
  requirements: string[];
  challenges: string[];
  tutorRole: string;
}

export interface RoadmapLevel {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  tasks: string[];
  status: 'locked' | 'unlocked' | 'completed' | 'in_progress';
  estimatedTime: string;
  project?: ProjectModule;
}

export interface Roadmap {
  id: string;
  skill: string;
  levels: RoadmapLevel[];
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface DailyActivity {
  date: string;
  minutes: number;
}

export interface AppState {
  profile: UserProfile | null;
  roadmap: Roadmap | null;
  assessmentResult: number | null;
  streak: number;
  activity: DailyActivity[];
  currentLevelId: string | null;
  isAuthenticated: boolean;
}

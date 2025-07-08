export type UserType = 'founder' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  avatar?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  createdAt: Date;
}

export interface Founder extends User {
  type: 'founder';
  company?: string;
  previousExperience?: string[];
}

export interface Employee extends User {
  type: 'employee';
  experience?: number;
  education?: string;
  currentRole?: string;
  salaryExpectation?: string;
  remotePreference?: 'remote' | 'hybrid' | 'onsite';
}

export type StartupStage = 'idea' | 'mvp' | 'early' | 'growth' | 'scale';
export type Industry = 
  | 'tech' 
  | 'fintech' 
  | 'healthtech' 
  | 'edtech' 
  | 'ecommerce' 
  | 'saas' 
  | 'marketplace' 
  | 'ai' 
  | 'blockchain' 
  | 'social' 
  | 'gaming' 
  | 'climate' 
  | 'foodtech' 
  | 'proptech' 
  | 'hr' 
  | 'other';

export interface Startup {
  id: string;
  founderId: string;
  name: string;
  industry: Industry;
  stage: StartupStage;
  location: string;
  remoteOk: boolean;
  teamSize: number;
  fundingRaised?: number;
  description: string; // This is hidden until match
  publicSummary: string; // This is what's shown in cards
  website?: string;
  lookingFor: string[]; // roles they're hiring for
  equity?: {
    min: number;
    max: number;
  };
  salary?: {
    min: number;
    max: number;
  };
  benefits?: string[];
  techStack?: string[];
  createdAt: Date;
  isActive: boolean;
}

export interface Match {
  id: string;
  startupId: string;
  employeeId: string;
  founderId: string;
  status: 'pending' | 'mutual' | 'rejected';
  employeeLiked: boolean;
  founderLiked: boolean;
  createdAt: Date;
  chatId?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  matchId: string;
  participants: string[]; // user IDs
  messages: Message[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface SwipeAction {
  startupId: string;
  userId: string;
  action: 'like' | 'pass';
  timestamp: Date;
}

export interface AppState {
  currentUser: User | null;
  startups: Startup[];
  matches: Match[];
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

export interface StartupContextType {
  startups: Startup[];
  currentStartup?: Startup;
  matches: Match[];
  swipeStartup: (startupId: string, action: 'like' | 'pass') => Promise<void>;
  createStartup: (startupData: Partial<Startup>) => Promise<boolean>;
  updateStartup: (startupId: string, startupData: Partial<Startup>) => Promise<boolean>;
  getNextStartup: () => Startup | null;
}
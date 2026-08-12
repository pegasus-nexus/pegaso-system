export interface CompanyData {
  companyName: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  sector: string;
  employeeCount: string;
  yearsInBusiness: string;
  consent: boolean;
}

export interface Question {
  id: string;
  dimensionCode: string;
  question: string;
}

export interface Dimension {
  code: string;
  name: string;
}

export interface Answer {
  questionId: string;
  value: number | null;
}

export interface AssessmentState {
  step: number; // 0: Welcome, 1: Form, 2: Instructions, 3-9: Dimensions, 10: Open Question, 11: Results
  companyData: CompanyData | null;
  answers: Answer[];
  openQuestionAnswer: string;
  completed: boolean;
}

export interface DimensionScore {
  code: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string; // Inicial, En desarrollo, Definido, Gestionado, Optimizado
}

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  maturityIndex: number; // Percentage 0-100
  level: number; // 1 to 5
  levelName: string;
  dimensionScores: DimensionScore[];
  topStrengths: DimensionScore[];
  topPriorities: DimensionScore[];
}

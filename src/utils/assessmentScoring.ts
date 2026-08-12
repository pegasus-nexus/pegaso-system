import type { Answer, AssessmentResult, DimensionScore } from '../types/assessment';
import { dimensions, questions } from '../data/assessmentQuestions';

export const getLevelName = (level: number): string => {
  switch (level) {
    case 1: return 'Inicial';
    case 2: return 'En desarrollo';
    case 3: return 'Definido';
    case 4: return 'Gestionado';
    case 5: return 'Optimizado';
    default: return 'No clasificado';
  }
};

export const getDimensionLevelName = (score: number): string => {
  if (score >= 21) return 'Optimizado';
  if (score >= 17) return 'Gestionado';
  if (score >= 13) return 'Definido';
  if (score >= 9) return 'En desarrollo';
  return 'Inicial';
};

export const calculateResults = (answers: Answer[]): AssessmentResult => {
  const totalScore = answers.reduce((sum, answer) => sum + (answer.value || 0), 0);
  const maxScore = 175; // 35 questions * 5
  
  // Calculate maturity index: ((Score - 35) / 140) * 100
  let maturityIndex = ((totalScore - 35) / 140) * 100;
  maturityIndex = Math.max(0, Math.min(100, Math.round(maturityIndex * 10) / 10)); // Round to 1 decimal

  // Calculate level based on total score ranges
  let level = 1;
  if (totalScore >= 147) level = 5;
  else if (totalScore >= 119) level = 4;
  else if (totalScore >= 91) level = 3;
  else if (totalScore >= 63) level = 2;

  // Calculate dimension scores
  const dimensionScores: DimensionScore[] = dimensions.map(dim => {
    // Find all questions for this dimension
    const dimQuestions = questions.filter(q => q.dimensionCode === dim.code);
    
    // Find answers for these questions
    const dimAnswers = answers.filter(a => dimQuestions.some(q => q.id === a.questionId));
    
    const score = dimAnswers.reduce((sum, a) => sum + (a.value || 0), 0);
    const dimMaxScore = 25; // 5 questions * 5
    
    // Dimension percentage: ((Score - 5) / 20) * 100
    let percentage = ((score - 5) / 20) * 100;
    percentage = Math.max(0, Math.min(100, Math.round(percentage * 10) / 10));

    return {
      code: dim.code,
      name: dim.name,
      score,
      maxScore: dimMaxScore,
      percentage,
      level: getDimensionLevelName(score)
    };
  });

  // Sort dimensions by score (percentage) to find strengths and priorities
  const sortedDimensions = [...dimensionScores].sort((a, b) => b.percentage - a.percentage);
  
  const topStrengths = sortedDimensions.slice(0, 2);
  const topPriorities = sortedDimensions.slice().reverse().slice(0, 2); // Lowest percentages

  return {
    totalScore,
    maxScore,
    maturityIndex,
    level,
    levelName: getLevelName(level),
    dimensionScores,
    topStrengths,
    topPriorities
  };
};

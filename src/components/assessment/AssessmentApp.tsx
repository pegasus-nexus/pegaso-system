import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { AssessmentState, CompanyData, Answer, AssessmentResult } from '../../types/assessment';
import { dimensions } from '../../data/assessmentQuestions';
import { calculateResults } from '../../utils/assessmentScoring';

// Get env variables in Vite/Astro
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

import { WelcomeScreen } from './WelcomeScreen';
import { CompanyForm } from './CompanyForm';
import { Instructions } from './Instructions';
import { Questionnaire } from './Questionnaire';
import { OpenQuestion } from './OpenQuestion';
import { ResultsScreen } from './ResultsScreen';

const STORAGE_KEY = 'pegasus_assessment_progress';

export const AssessmentApp: React.FC = () => {
  const [state, setState] = useState<AssessmentState>({
    step: 0,
    companyData: null,
    answers: [],
    openQuestionAnswer: '',
    completed: false
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
        if (parsed.completed) {
          setResults(calculateResults(parsed.answers));
        }
      } catch (e) {
        console.error("Error loading assessment state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const handleNextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
  const handlePrevStep = () => setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));

  const handleCompanyDataSubmit = (data: CompanyData) => {
    setState(prev => ({ ...prev, companyData: data, step: prev.step + 1 }));
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setState(prev => {
      const existingAnswers = [...prev.answers];
      const index = existingAnswers.findIndex(a => a.questionId === questionId);
      
      if (index >= 0) {
        existingAnswers[index] = { questionId, value };
      } else {
        existingAnswers.push({ questionId, value });
      }
      
      return { ...prev, answers: existingAnswers };
    });
  };

  const handleFinish = async () => {
    const calcResults = calculateResults(state.answers);
    
    const finalState = {
      ...state,
      step: state.step + 1,
      completed: true
    };
    
    setState(finalState);
    setResults(calcResults);

    // Guardar en base de datos (Supabase) directamente desde el cliente
    if (supabaseUrl && supabaseKey && finalState.companyData) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('assessment_leads')
          .insert([
            {
              company_name: finalState.companyData.companyName,
              contact_name: finalState.companyData.contactName,
              role: finalState.companyData.role,
              email: finalState.companyData.email,
              phone: finalState.companyData.phone,
              city: finalState.companyData.city,
              country: finalState.companyData.country,
              sector: finalState.companyData.sector,
              employee_count: finalState.companyData.employeeCount,
              years_in_business: finalState.companyData.yearsInBusiness,
              total_score: calcResults.totalScore,
              maturity_index: calcResults.maturityIndex,
              level: calcResults.level,
              level_name: calcResults.levelName,
              open_question_answer: finalState.openQuestionAnswer,
              created_at: new Date().toISOString()
            }
          ]);
      } catch (error) {
        console.error("Error saving to database:", error);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm("¿Está seguro de querer iniciar una nueva evaluación? Perderá los resultados actuales.")) {
      const resetState: AssessmentState = {
        step: 0,
        companyData: null,
        answers: [],
        openQuestionAnswer: '',
        completed: false
      };
      setState(resetState);
      setResults(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  // Render correct step
  return (
    <div className="w-full">
      {state.step === 0 && (
        <WelcomeScreen onNext={handleNextStep} />
      )}
      
      {state.step === 1 && (
        <CompanyForm 
          initialData={state.companyData} 
          onNext={handleCompanyDataSubmit} 
          onBack={handlePrevStep} 
        />
      )}
      
      {state.step === 2 && (
        <Instructions 
          onNext={handleNextStep} 
          onBack={handlePrevStep} 
        />
      )}
      
      {/* Dimension steps: 3 to 9 (7 dimensions) */}
      {state.step >= 3 && state.step <= 9 && (
        <Questionnaire
          dimensionIndex={state.step - 3}
          answers={state.answers}
          onAnswerChange={handleAnswerChange}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      )}

      {/* Open Question */}
      {state.step === 10 && (
        <OpenQuestion 
          answer={state.openQuestionAnswer}
          onAnswerChange={(val) => setState(prev => ({ ...prev, openQuestionAnswer: val }))}
          onNext={handleFinish}
          onBack={handlePrevStep}
        />
      )}

      {/* Results */}
      {state.step === 11 && results && (
        <ResultsScreen 
          result={results}
          companyData={state.companyData}
          openQuestionAnswer={state.openQuestionAnswer}
          answers={state.answers}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

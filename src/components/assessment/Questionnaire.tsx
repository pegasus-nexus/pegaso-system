import React from 'react';
import type { Answer, Dimension, Question } from '../../types/assessment';
import { likertScale, questions, dimensions } from '../../data/assessmentQuestions';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface QuestionnaireProps {
  dimensionIndex: number;
  answers: Answer[];
  onAnswerChange: (questionId: string, value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ 
  dimensionIndex, 
  answers, 
  onAnswerChange, 
  onNext, 
  onBack 
}) => {
  const currentDimension = dimensions[dimensionIndex];
  const dimensionQuestions = questions.filter(q => q.dimensionCode === currentDimension.code);
  
  const totalQuestions = questions.length;
  const answeredCount = answers.filter(a => a.value !== null).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  // Check if all questions in the current dimension are answered
  const allDimensionQuestionsAnswered = dimensionQuestions.every(q => 
    answers.some(a => a.questionId === q.id && a.value !== null)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 opacity-100">
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span>Progreso general</span>
          <span>{answeredCount} de {totalQuestions} preguntas respondidas</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-10 shadow-2xl">
        <div className="mb-8 border-b border-slate-700/50 pb-4">
          <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase">
            Dimensión {dimensionIndex + 1} de {dimensions.length}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 text-white">{currentDimension.name}</h2>
        </div>

        <div className="space-y-10 mb-10">
          {dimensionQuestions.map((q, index) => {
            const answer = answers.find(a => a.questionId === q.id);
            return (
              <div key={q.id} className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/30">
                <div className="flex gap-4 mb-6">
                  <div className="text-slate-500 font-mono text-sm mt-1">{q.id}</div>
                  <h3 className="text-lg text-slate-200 font-medium">{q.question}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {likertScale.map(scale => {
                    const isSelected = answer?.value === scale.value;
                    return (
                      <button
                        key={scale.value}
                        onClick={() => onAnswerChange(q.id, scale.value)}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        <span className={`text-2xl font-bold mb-2 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                          {scale.value}
                        </span>
                        <span className={`text-xs text-center ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                          {scale.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-10 border-t border-slate-700/50 pt-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 transition-colors"
          >
            <ArrowLeft size={18} /> Anterior
          </button>
          
          <button 
            onClick={onNext}
            disabled={!allDimensionQuestionsAnswered}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              allDimensionQuestionsAnswered 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Siguiente <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

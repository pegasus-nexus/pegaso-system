import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface OpenQuestionProps {
  answer: string;
  onAnswerChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

export const OpenQuestion: React.FC<OpenQuestionProps> = ({ answer, onAnswerChange, onNext, onBack, submitting, submitError }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 opacity-100">
      <div className="glass-card rounded-2xl p-6 md:p-10 shadow-2xl">
        <div className="mb-8 border-b border-slate-700/50 pb-4">
          <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase">Pregunta Final (Opcional)</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 text-white">Último paso</h2>
        </div>

        <div className="bg-slate-900/40 rounded-xl p-6 md:p-8 border border-slate-700/30">
          <label className="block text-xl text-slate-200 font-medium mb-6 leading-relaxed">
            Si pudiera resolver un solo problema de su empresa durante los próximos doce meses, ¿cuál elegiría y por qué?
          </label>
          <textarea
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full h-40 bg-slate-900/80 border border-slate-700 text-white rounded-lg p-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            placeholder="Escriba su respuesta aquí..."
          />
          <p className="text-slate-500 text-sm mt-3">
            Esta pregunta no afecta su puntaje final, pero nos ayuda a entender mejor sus prioridades.
          </p>
        </div>

        {submitError && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {submitError}
          </div>
        )}

        <div className="flex justify-between items-center mt-10">
          <button 
            onClick={onBack}
            disabled={submitting}
            className={`flex items-center gap-2 px-4 py-2 transition-colors ${submitting ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:text-white'}`}
          >
            <ArrowLeft size={18} /> Anterior
          </button>
          
          <button 
            onClick={onNext}
            disabled={submitting}
            className={`flex items-center gap-2 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 ${submitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}
          >
            {submitting ? 'Guardando...' : 'Ver Resultados'} {!submitting && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

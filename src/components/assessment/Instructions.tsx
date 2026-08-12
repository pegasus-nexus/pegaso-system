import React from 'react';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { likertScale } from '../../data/assessmentQuestions';

interface InstructionsProps {
  onNext: () => void;
  onBack: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onNext, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 opacity-100">
      <div className="glass-card rounded-2xl p-6 md:p-10 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 font-heading text-white">Instrucciones</h2>
        
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-5 mb-8 flex items-start gap-4">
          <Info className="text-blue-400 mt-1 flex-shrink-0" />
          <p className="text-blue-100 text-lg">
            Seleccione la opción que describa mejor la situación <span className="font-bold text-white">actual</span> de su empresa, no la situación que espera alcanzar en el futuro.
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-6 text-slate-200">Escala de Evaluación:</h3>
        
        <div className="space-y-4 mb-10">
          {likertScale.map((item) => (
            <div key={item.value} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-lg border border-slate-600 flex-shrink-0">
                {item.value}
              </div>
              <p className="text-slate-300 text-base">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 transition-colors"
          >
            <ArrowLeft size={18} /> Anterior
          </button>
          <button 
            onClick={onNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            Iniciar cuestionario <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

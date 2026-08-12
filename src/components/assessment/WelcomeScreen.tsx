import React from 'react';
import { ArrowRight, Clock, Target, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 opacity-100">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-white">
          Pegasus <span className="text-blue-500">Assessment</span>
        </h1>
        <h2 className="text-2xl text-slate-300 font-sans">Evaluación de Madurez Empresarial</h2>
      </div>

      <div className="glass-card rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Target size={120} />
        </div>
        
        <p className="text-lg text-slate-200 mb-8 leading-relaxed max-w-3xl relative z-10">
          Este diagnóstico permite conocer el nivel actual de madurez de su empresa en áreas estratégicas como dirección, clientes, procesos, personas, finanzas, tecnología y crecimiento. Responda considerando la situación real de su empresa.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-10 relative z-10">
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <CheckCircle2 className="text-blue-400" /> Beneficios
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span> Identifica fortalezas y áreas de mejora.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span> Obtiene una calificación objetiva del negocio.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span> Recibe recomendaciones estratégicas claras.
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="text-blue-400 w-8 h-8" />
              <div>
                <p className="text-sm text-slate-400">Tiempo estimado</p>
                <p className="text-lg font-semibold text-white">15 a 20 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Target className="text-blue-400 w-8 h-8" />
              <div>
                <p className="text-sm text-slate-400">Preguntas</p>
                <p className="text-lg font-semibold text-white">35 preguntas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center relative z-10">
          <button
            onClick={onNext}
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-105"
          >
            Comenzar evaluación
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

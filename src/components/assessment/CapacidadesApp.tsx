import React, { useEffect, useMemo, useState } from 'react';
type Answers = Record<string, string | string[]>;

const STORAGE_KEY = 'pegasus-capacidades-assessment';
const SESSION_KEY = 'pegasus-capacidades-session';

const scale = ['No existe', 'Inicial', 'Parcial', 'Consistente', 'Integrada y medible'];
const steps = ['Perfil', 'Situación', 'Capacidades', 'Prioridad', 'Contacto'];

const single = (id: string, label: string, options: string[]) => ({ id, label, options });

const profile = [
  single('P01', '¿Cuál es el sector principal de tu empresa?', ['Retail / comercio', 'Distribución', 'Alimentos', 'Manufactura', 'Servicios', 'Salud', 'Educación', 'Otro']),
  single('P02', '¿Cuántas personas trabajan aproximadamente en la empresa?', ['1–9', '10–49', '50–199', '200 o más', 'Prefiero no indicarlo']),
  single('P03', '¿Cómo opera actualmente la empresa?', ['Una ubicación', '2–3 ubicaciones', '4 o más', 'Venta por varios canales', 'Operación distribuida sin sucursales']),
  single('P04', '¿Cuál es tu función principal?', ['Propietario / gerencia', 'Operaciones', 'Administración / finanzas', 'Comercial / marketing', 'Tecnología', 'Consultoría', 'Otro'])
];

const situation = [
  single('P06', '¿Dónde se concentra actualmente la información operativa?', ['Un sistema integrado', 'Varios sistemas conectados', 'Varios sistemas no conectados', 'Hojas de cálculo', 'Registros manuales', 'No existe una fuente común']),
  single('P07', '¿Con qué frecuencia la gerencia recibe información útil para decidir?', ['Tiempo real', 'Diaria', 'Semanal', 'Mensual', 'Cuando se solicita', 'No existe una frecuencia definida'])
];

const maturity: [string, string, string][] = [
  ['P08', 'Los procesos críticos están documentados y se ejecutan con criterios comunes.', 'Procesos y gobierno'],
  ['P09', 'Las responsabilidades, aprobaciones y excepciones están claramente definidas.', 'Procesos y gobierno'],
  ['P10', 'Existe una fuente confiable y compartida para los datos principales del negocio.', 'Datos e indicadores'],
  ['P11', 'Los reportes llegan con la frecuencia necesaria y permiten actuar a tiempo.', 'Datos e indicadores'],
  ['P12', 'El inventario, las ventas y los movimientos pueden rastrearse hasta su origen.', 'Control operativo'],
  ['P13', 'La caja, los cobros y las conciliaciones cuentan con controles y evidencia suficiente.', 'Control operativo'],
  ['P14', 'Las áreas y sistemas comparten información sin reprocesos relevantes.', 'Integración y automatización'],
  ['P15', 'Las tareas repetitivas con reglas claras están automatizadas o controladas.', 'Integración y automatización'],
  ['P16', 'La gerencia utiliza indicadores definidos para priorizar y dar seguimiento.', 'Decisión y mejora'],
  ['P17', 'Existe un responsable y tiempo asignado para implementar mejoras operativas.', 'Decisión y mejora']
];

const priority = [
  single('P18', 'Si esta situación continúa, ¿qué impacto tendrá en el negocio?', ['Bajo', 'Moderado', 'Alto', 'Crítico', 'Todavía no puedo estimarlo']),
  single('P19', '¿En qué plazo necesitas avanzar?', ['Explorando', '3–6 meses', '1–3 meses', 'Inmediatamente', 'No está definido']),
  single('P20', '¿Qué te gustaría hacer al finalizar?', ['Solo ver mi resultado', 'Recibir una copia', 'Revisar el resultado 20 minutos', 'Conversar sobre un diagnóstico'])
];

const painOptions = ['Ventas', 'Inventario', 'Costos / margen', 'Caja / QR', 'Cobranza', 'Clientes', 'Reportes', 'Sistemas fragmentados', 'Tareas manuales', 'Otro'];

const dims: { name: string; ids: string[] }[] = [
  { name: 'Procesos y gobierno', ids: ['P08', 'P09'] },
  { name: 'Datos e indicadores', ids: ['P10', 'P11'] },
  { name: 'Control operativo', ids: ['P12', 'P13'] },
  { name: 'Integración y automatización', ids: ['P14', 'P15'] },
  { name: 'Decisión y mejora', ids: ['P16', 'P17'] }
];

const stepTitles = [
  'Conozcamos tu empresa',
  '¿Dónde se pierde el control?',
  'Capacidades de gestión',
  'Prioridad y siguiente paso',
  'Recibe tu resultado'
];

const stepDescriptions = [
  'Selecciona la opción que mejor describe tu realidad actual.',
  'Selecciona la opción que mejor describe tu realidad actual.',
  'Valora cada afirmación del 1 al 5 según tu grado de implementación.',
  'Selecciona la opción que mejor describe tu realidad actual.',
  'Usaremos estos datos únicamente para enviarte el resultado y conversar sobre esta evaluación.'
];

// Helper to get matching SVG icons for each option
const getOptionIcon = (label: string) => {
  switch (label) {
    case 'Retail / comercio':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      );
    case 'Distribución':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      );
    case 'Alimentos':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2v20M14 2v6a3 3 0 0 0 3 3v11M6 2v7a2 2 0 0 0 2 2v11M10 2v7a2 2 0 0 1-2 2"/>
        </svg>
      );
    case 'Manufactura':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      );
    case 'Servicios':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      );
    case 'Salud':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28"/>
        </svg>
      );
    case 'Educación':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
        </svg>
      );
    case 'Otro':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><circle cx="8" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="16" cy="12" r="1" fill="currentColor"/>
        </svg>
      );
    case '1–9':
    case '10–49':
    case '50–199':
    case '200 o más':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case 'Prefiero no indicarlo':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      );
    case 'Una ubicación':
    case '2–3 ubicaciones':
    case '4 o más':
    case 'Venta por varios canales':
    case 'Operación distribuida sin sucursales':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      );
    case 'Propietario / gerencia':
    case 'Operaciones':
    case 'Administración / finanzas':
    case 'Comercial / marketing':
    case 'Tecnología':
    case 'Consultoría':
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 14 14"/>
        </svg>
      );
  }
};

interface OptionGroupProps {
  q: { id: string; label: string; options: string[] };
  answers: Answers;
  setAnswer: (id: string, v: string) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({ q, answers, setAnswer }) => {
  const isFourCols = q.options.length === 8;
  const isThreeCols = q.options.length === 5 || q.options.length === 6;

  return (
    <div className="question-block mb-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest font-mono">
          {q.id}
        </span>
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-white mb-3.5 leading-snug">
        {q.label}
      </h3>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isFourCols ? 'lg:grid-cols-4' : isThreeCols ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-3`}>
        {q.options.map(o => {
          const isSelected = answers[q.id] === o;
          return (
            <button
              type="button"
              key={o}
              onClick={() => setAnswer(q.id, o)}
              className={`choice-card p-3.5 flex items-center justify-between text-left transition-all ${isSelected ? 'selected' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {getOptionIcon(o)}
                <span className={`text-xs leading-tight truncate ${isSelected ? 'font-semibold text-white' : 'font-medium text-gray-300'}`}>
                  {o}
                </span>
              </div>
              {isSelected && (
                <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shadow-[0_0_8px_#3b82f6] shrink-0">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface CapacidadesResult {
  leadId: string;
  index: number;
  band: string;
  message: string;
  dimensions: { name: string; score: number }[];
  strength: string;
  priority: string;
}

const computeResult = (answers: Answers): CapacidadesResult => {
  const dimensions = dims.map(d => {
    const values = d.ids.map(id => Number(answers[id]) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const score = Math.max(0, Math.min(100, Math.round(((sum - 2) / 8) * 100)));
    return { name: d.name, score };
  });

  const index = Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dims.length);

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const strength = sorted[0].name;
  const priorityDim = sorted[sorted.length - 1].name;

  let band: string;
  let message: string;
  if (index >= 80) {
    band = 'Operación integrada y en mejora continua';
    message = 'Tus capacidades de gestión están consolidadas, medidas y mejorando de forma continua. Se recomienda profundizar en automatización y escalamiento.';
  } else if (index >= 60) {
    band = 'Gestión consolidada';
    message = 'Tus procesos, datos e indicadores funcionan de manera consistente. Existen brechas puntuales que, bien trabajadas, te permitirán escalar con control.';
  } else if (index >= 40) {
    band = 'Gestión en desarrollo';
    message = 'Existen avances importantes en varias capacidades, pero el control aún depende de esfuerzos parciales. Es momento de definir criterios, fuentes de datos y seguimiento.';
  } else if (index >= 20) {
    band = 'Gestión inicial';
    message = 'La operación funciona con prácticas informales y gran dependencia de personas clave. Ordenar la información, definir responsabilidades y documentar procesos aporta el mayor valor.';
  } else {
    band = 'Gestión emergente';
    message = 'Todavía no existen mecanismos sistemáticos de gestión. Partir de controles básicos y una fuente común de información es el punto de partida recomendado.';
  }

  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const leadId = `PGS-${randomPart}`;

  return { leadId, index, band, message, dimensions, strength, priority: priorityDim };
};

interface ContactFormProps {
  answers: Answers;
  setAnswer: (id: string, v: string) => void;
  errors: string[];
}

const ContactForm: React.FC<ContactFormProps> = ({ answers, setAnswer, errors }) => {
  const fields: [string, string, string][] = [
    ['name', 'Nombre y apellido', 'text'],
    ['company', 'Empresa', 'text'],
    ['email', 'Correo electrónico', 'email'],
    ['phone', 'WhatsApp', 'tel'],
    ['city', 'Ciudad / departamento', 'text']
  ];

  return (
    <div className="contact-grid">
      {fields.map(([id, label, type]) => (
        <label className="field" key={id}>
          <span>{label}</span>
          <input
            type={type}
            value={String(answers[id] || '')}
            onChange={e => setAnswer(id, e.target.value)}
            className={errors.includes(id) ? 'invalid' : ''}
          />
        </label>
      ))}
      <label className={errors.includes('consent') ? 'consent invalid-consent' : 'consent'}>
        <input
          type="checkbox"
          checked={answers.consent === 'yes'}
          onChange={e => setAnswer('consent', e.target.checked ? 'yes' : '')}
        />
        <span>
          Acepto que Pegasus Nexus utilice estos datos para enviarme el resultado y contactarme sobre esta evaluación.{' '}
          <a href="#privacidad">Política de privacidad</a>.
        </span>
      </label>
    </div>
  );
};

interface ResultProps {
  result: CapacidadesResult;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ result, onRestart }) => {
  const wa = `https://wa.me/59179786916?text=${encodeURIComponent(`Hola Marco, completé la Evaluación de Capacidades Pegasus. Mi código es ${result.leadId}. Quisiera revisar mi resultado.`)}`;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <section className="glass-card p-8 sm:p-10 mb-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-sky-400 font-semibold block mb-2">
            TU RESULTADO ORIENTATIVO
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-white mb-3">
            {result.band}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed max-w-xl mb-4">
            {result.message}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400/30 text-xs text-sky-300 font-mono">
            Código de evaluación: <b className="text-white font-bold">{result.leadId}</b>
          </div>
        </div>

        <div className="w-36 h-36 rounded-full border-4 border-sky-500/30 flex flex-col items-center justify-center bg-sky-950/40 shadow-[0_0_30px_rgba(56,189,248,0.3)] shrink-0">
          <strong className="text-4xl font-black text-white font-montserrat">{result.index}</strong>
          <span className="text-xs text-sky-400 font-medium tracking-wider">/ 100</span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 glass-card p-6 sm:p-8">
          <h2 className="text-base font-bold text-white mb-6 font-montserrat">Tus cinco capacidades</h2>
          <div className="space-y-4">
            {result.dimensions.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-xs text-gray-200 mb-1.5 font-medium">
                  <span>{d.name}</span>
                  <span className="text-sky-400 font-bold">{d.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 shadow-[0_0_8px_#38bdf8]" style={{ width: `${d.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="md:col-span-5 glass-card p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-semibold block mb-2">Lectura preliminar</span>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Fortaleza</h3>
            <p className="text-xs text-gray-200 mb-4 font-light">
              <b className="text-white font-semibold">{result.strength}</b> es tu capacidad más desarrollada.
            </p>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Oportunidad prioritaria</h3>
            <p className="text-xs text-gray-200 mb-6 font-light">
              <b className="text-white font-semibold">{result.priority}</b> concentra la mayor oportunidad de mejora.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.8)] transition-all cursor-pointer text-center"
            >
              <span>Conversar con Marco</span>
              <span className="text-sm">↗</span>
            </a>
            <button
              onClick={onRestart}
              className="w-full py-2.5 px-4 rounded-full border border-white/20 text-gray-300 hover:text-white text-xs transition-colors"
            >
              Nueva evaluación
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export const CapacidadesApp: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CapacidadesResult | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {
      // Intentional: datos corruptos se descartan
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const setAnswer = (id: string, v: string | string[]) => {
    setAnswers(a => ({ ...a, [id]: v }));
    setErrors(e => e.filter(x => x !== id));
  };

  const togglePain = (v: string) => {
    const cur = (answers.P05 as string[]) || [];
    if (cur.includes(v)) setAnswer('P05', cur.filter(x => x !== v));
    else if (cur.length < 3) setAnswer('P05', [...cur, v]);
  };

  const required = useMemo(() => {
    switch (step) {
      case 0: return ['P01', 'P02', 'P03', 'P04'];
      case 1: return ['P05', 'P06', 'P07'];
      case 2: return maturity.map(x => x[0]);
      case 3: return ['P18', 'P19', 'P20'];
      default: return ['name', 'company', 'email', 'phone', 'city', 'consent'];
    }
  }, [step]);

  const validate = () => {
    const missing = required.filter(id =>
      id === 'email' ? !/^\S+@\S+\.\S+$/.test(String(answers[id] || ''))
      : id === 'phone' ? String(answers[id] || '').replace(/\D/g, '').length < 7
      : id === 'P05' ? !Array.isArray(answers.P05) || !answers.P05.length
      : !answers[id]
    );
    setErrors(missing);
    return !missing.length;
  };

  const next = () => {
    if (!validate()) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(4, s + 1));
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const sessionId = sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sessionId);

      const resultData = computeResult(answers);

      try {
          const session_duration_seconds = Math.floor((Date.now() - startTime) / 1000);
          const urlParams = new URLSearchParams(window.location.search);
          const utm_source = urlParams.get('utm_source');
          const utm_medium = urlParams.get('utm_medium');
          const utm_campaign = urlParams.get('utm_campaign');
          const user_agent = navigator.userAgent;
          
          let company_domain = null;
          const email = String(answers.email || '');
          if (email) {
              const parts = email.split('@');
              if (parts.length === 2) {
                  company_domain = parts[1];
              }
          }

          await fetch('/api/save-capacidades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              lead_id: resultData.leadId,
              score_total: resultData.index,
              band: resultData.band,
              strength: resultData.strength,
              priority: resultData.priority,
              answers,
              duration_seconds: session_duration_seconds,
              utm_source,
              utm_medium,
              utm_campaign,
              user_agent,
              company_domain
            })
          });

          setResult(resultData);
          sessionStorage.removeItem(STORAGE_KEY);
      } catch (error) {
          console.error('Error saving to database:', error);
          setSubmitError("No se pudo guardar la evaluación. Por favor revisa tu conexión e intenta de nuevo.");
      }
    } catch {
      setErrors(['submit']);
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setErrors([]);
    setResult(null);
    sessionStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) return <Result result={result} onRestart={restart} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Aside Card */}
      <aside className="lg:col-span-4 xl:col-span-3 glass-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-sky-400 font-mono block mb-3">
            EVALUACIÓN DE CAPACIDADES
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-normal text-white leading-snug mb-3">
            Un mapa claro para tu siguiente decisión.
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-light mb-8">
            Responde según la situación actual de tu empresa. No hay respuestas correctas o incorrectas.
          </p>

          {/* Step Indicators with vertical dashed line */}
          <div className="space-y-1 relative pl-1">
            {steps.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;

              return (
                <React.Fragment key={s}>
                  {i > 0 && (
                    <div className="w-px h-3.5 border-l border-dashed border-gray-600/80 ml-6 my-0.5" />
                  )}
                  <div
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/35 to-sky-500/15 border border-sky-400/50 text-white font-semibold shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                        : isDone
                        ? 'text-gray-300 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-blue-500 text-white shadow-[0_0_10px_#3b82f6]'
                            : isDone
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                            : 'border border-gray-600 text-gray-400'
                        }`}
                      >
                        {isDone ? '✓' : i + 1}
                      </span>
                      <span className="text-xs tracking-wide">{s}</span>
                    </div>
                    {isActive && <span className="text-sky-400 font-bold text-sm">›</span>}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Security Bottom Sub-card */}
        <div className="mt-8 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <p className="text-[10.5px] text-gray-400 leading-snug font-light">
            Tus datos están protegidos y serán utilizados únicamente para fines de evaluación.
          </p>
        </div>
      </aside>

      {/* Right Main Form Panel */}
      <section className="lg:col-span-8 xl:col-span-9 glass-card p-6 sm:p-8">
        
        {/* Top Security & Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-sky-300 font-semibold font-mono">
            <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span>RESULTADO ORIENTATIVO · DATOS PROTEGIDOS</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="text-[11px] font-medium text-gray-300">Paso {step + 1} de 5 · {steps[step]}</span>
            <div className="w-32 h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 shadow-[0_0_8px_#38bdf8] transition-all duration-300"
                style={{ width: `${(step + 1) * 20}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-sky-400">{Math.round((step + 1) * 20)}%</span>
          </div>
        </div>

        {/* Step Heading */}
        <div className="flex items-start gap-4 mb-8">
          <span className="text-3xl sm:text-4xl font-cinzel text-sky-400/90 font-bold leading-none">
            0{step + 1}
          </span>
          <div className="w-px h-10 bg-white/20"></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-white leading-tight">
              {stepTitles[step]}
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-light">
              {stepDescriptions[step]}
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="error-summary mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs" role="alert">
            Revisa los campos señalados antes de continuar.
          </div>
        )}

        {step === 0 && profile.map(q => (
          <OptionGroup key={q.id} q={q} answers={answers} setAnswer={setAnswer} />
        ))}

        {step === 1 && (
          <>
            <fieldset className="question mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest font-mono">P05</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-3.5 leading-snug">
                ¿Qué problemas te generan hoy mayor pérdida de control o tiempo? <span className="text-sky-400 font-normal italic text-xs ml-1">(Elige hasta 3)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {painOptions.map(o => {
                  const selected = ((answers.P05 as string[]) || []).includes(o);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => togglePain(o)}
                      disabled={!selected && ((answers.P05 as string[]) || []).length >= 3}
                      className={`choice-card p-3 flex items-center justify-between text-left transition-all ${selected ? 'selected' : ''}`}
                    >
                      <span className={`text-xs ${selected ? 'font-semibold text-white' : 'font-medium text-gray-300'}`}>{o}</span>
                      {selected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold shadow-[0_0_6px_#3b82f6]">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {situation.map(q => (
              <OptionGroup key={q.id} q={q} answers={answers} setAnswer={setAnswer} />
            ))}
          </>
        )}

        {step === 2 && (
          <div className="scale-wrap">
            <div className="scale-key flex justify-between text-xs text-sky-300 font-mono mb-4 px-1">
              <span>1 · No existe</span>
              <span>5 · Integrada y medible</span>
            </div>
            {maturity.map(([id, label, dim]) => (
              <fieldset className="scale-question mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]" key={id}>
                <legend className="text-xs sm:text-sm font-semibold text-white mb-3">
                  <span className="text-[10px] font-mono text-sky-400 block mb-1">{id} · {dim}</span>
                  {label}
                </legend>
                <div className="grid grid-cols-5 gap-2">
                  {scale.map((s, i) => {
                    const isSelected = answers[id] === String(i + 1);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setAnswer(id, String(i + 1))}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600/40 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-sky-400/40'
                        }`}
                      >
                        <b className="block text-sm font-bold">{i + 1}</b>
                        <span className="text-[9px] hidden sm:block text-gray-400 leading-tight mt-1 truncate">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        )}

        {step === 3 && priority.map(q => (
          <OptionGroup key={q.id} q={q} answers={answers} setAnswer={setAnswer} />
        ))}

        {step === 4 && (
          <ContactForm answers={answers} setAnswer={setAnswer} errors={errors} />
        )}

        {submitError && (
          <div className="error-summary mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs" role="alert">
            {submitError}
          </div>
        )}

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-white/[0.08]">
          {step > 0 ? (
            <button
              type="button"
              className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
              onClick={() => setStep(s => s - 1)}
              disabled={submitting}
            >
              ← Anterior
            </button>
          ) : <div />}

          <button
            type="button"
            className="px-7 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-sky-400 hover:from-blue-500 hover:to-sky-300 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
            onClick={step === 4 ? submit : next}
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : step === 4 ? 'Ver mi resultado' : 'SIGUIENTE →'}
          </button>
        </div>

      </section>

    </div>
  );
};
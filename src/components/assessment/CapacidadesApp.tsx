import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type Answers = Record<string, string | string[]>;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

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
  'Valora cada afirmación del 1 al 5.',
  'Selecciona la opción que mejor describe tu realidad actual.',
  'Usaremos estos datos únicamente para enviarte el resultado y conversar sobre esta evaluación.'
];

interface OptionGroupProps {
  q: { id: string; label: string; options: string[] };
  answers: Answers;
  setAnswer: (id: string, v: string) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({ q, answers, setAnswer }) => {
  return (
    <fieldset className="question">
      <legend>
        <small>{q.id}</small>
        {q.label}
      </legend>
      <div className="choice-grid">
        {q.options.map(o => (
          <label key={o} className={answers[q.id] === o ? 'choice selected' : 'choice'}>
            <input type="radio" name={q.id} checked={answers[q.id] === o} onChange={() => setAnswer(q.id, o)} />
            <span>{o}</span>
            <i aria-hidden="true">✓</i>
          </label>
        ))}
      </div>
    </fieldset>
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
    <main className="result-shell">
      <header className="assessment-header">
        <a href="/" className="brand">
          <span className="brand-mark">P</span>
          <span>Pegasus <b>Nexus</b></span>
        </a>
        <span className="secure-note">Evaluación completada</span>
      </header>

      <section className="result-hero">
        <div>
          <span className="eyebrow">Tu resultado orientativo</span>
          <h1>{result.band}</h1>
          <p>{result.message}</p>
          <div className="result-code">
            Código de evaluación <b>{result.leadId}</b>
          </div>
        </div>
        <div className="score-ring" style={{ ['--score' as string]: result.index } as React.CSSProperties}>
          <div>
            <strong>{result.index}</strong>
            <span>/ 100</span>
          </div>
        </div>
      </section>

      <section className="result-body">
        <div className="dimension-card">
          <div className="section-title">
            <span>01</span>
            <h2>Tus cinco capacidades</h2>
          </div>
          {result.dimensions.map(d => (
            <div className="dimension-row" key={d.name}>
              <div>
                <b>{d.name}</b>
                <span>{d.score}%</span>
              </div>
              <i>
                <em style={{ width: `${d.score}%` }} />
              </i>
            </div>
          ))}
        </div>

        <aside className="insight-card">
          <span className="mini-label">Lectura preliminar</span>
          <h3>Fortaleza</h3>
          <p><b>{result.strength}</b> aparece como tu capacidad más desarrollada.</p>
          <h3>Oportunidad prioritaria</h3>
          <p><b>{result.priority}</b> concentra la mayor oportunidad de mejora.</p>
          <a className="whatsapp-button" href={wa} target="_blank" rel="noreferrer">
            Conversar con Marco <span>↗</span>
          </a>
          <p className="privacy-note">WhatsApp recibirá únicamente tu código de evaluación.</p>
        </aside>
      </section>

      <footer className="result-footer">
        <p>Este resultado no reemplaza un diagnóstico técnico o empresarial.</p>
        <button onClick={onRestart}>Nueva evaluación</button>
      </footer>
    </main>
  );
};

export const CapacidadesApp: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CapacidadesResult | null>(null);

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
    try {
      const sessionId = sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sessionId);

      const resultData = computeResult(answers);

      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey);
          await supabase.from('assessment_capacidades').insert([
            {
              lead_id: resultData.leadId,
              name: String(answers.name || ''),
              company: String(answers.company || ''),
              email: String(answers.email || ''),
              phone: String(answers.phone || ''),
              city: String(answers.city || ''),
              responses: answers,
              result_index: resultData.index,
              band: resultData.band,
              dimensions: resultData.dimensions,
              strength: resultData.strength,
              priority: resultData.priority,
              message: resultData.message
            }
          ]);
        } catch (error) {
          console.error('Error saving to database:', error);
        }
      }

      setResult(resultData);
      sessionStorage.removeItem(STORAGE_KEY);
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
    <main className="assessment-shell">
      <header className="assessment-header">
        <a href="/" className="brand">
          <span className="brand-mark">P</span>
          <span>Pegasus <b>Nexus</b></span>
        </a>
        <span className="secure-note">Resultado orientativo · Datos protegidos</span>
      </header>

      <div className="assessment-grid">
        <aside className="step-aside">
          <span className="eyebrow">Evaluación de capacidades</span>
          <h2>Un mapa claro para tu siguiente decisión.</h2>
          <p>Responde según la situación actual de tu empresa. No hay respuestas correctas o incorrectas.</p>
          <ol>
            {steps.map((s, i) => (
              <li key={s} className={i === step ? 'active' : i < step ? 'done' : ''}>
                <span>{i < step ? '✓' : i + 1}</span>
                <b>{s}</b>
              </li>
            ))}
          </ol>
        </aside>

        <section className="form-panel">
          <div className="mobile-progress">
            <span>Paso {step + 1} de 5 · {steps[step]}</span>
            <b>{Math.round((step + 1) * 20)}%</b>
            <i style={{ width: `${(step + 1) * 20}%` }} />
          </div>

          <div className="form-heading">
            <span>0{step + 1}</span>
            <div>
              <h1>{stepTitles[step]}</h1>
              <p>{stepDescriptions[step]}</p>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="error-summary" role="alert">Revisa los campos señalados antes de continuar.</div>
          )}

          {step === 0 && profile.map(q => (
            <OptionGroup key={q.id} q={q} answers={answers} setAnswer={setAnswer} />
          ))}

          {step === 1 && (
            <>
              <fieldset className="question">
                <legend>
                  <small>P05</small>
                  ¿Qué problemas te generan hoy mayor pérdida de control o tiempo? <em>Elige hasta 3</em>
                </legend>
                <div className="choice-grid compact">
                  {painOptions.map(o => {
                    const selected = ((answers.P05 as string[]) || []).includes(o);
                    return (
                      <label key={o} className={selected ? 'choice selected' : 'choice'}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => togglePain(o)}
                          disabled={!selected && ((answers.P05 as string[]) || []).length >= 3}
                        />
                        <span>{o}</span>
                        <i>✓</i>
                      </label>
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
              <div className="scale-key">
                <span>1 · No existe</span>
                <span>5 · Integrada y medible</span>
              </div>
              {maturity.map(([id, label, dim]) => (
                <fieldset className="scale-question" key={id}>
                  <legend>
                    <small>{id} · {dim}</small>
                    {label}
                  </legend>
                  <div>
                    {scale.map((s, i) => (
                      <label key={s} className={answers[id] === String(i + 1) ? 'scale selected' : 'scale'}>
                        <input
                          type="radio"
                          name={id}
                          checked={answers[id] === String(i + 1)}
                          onChange={() => setAnswer(id, String(i + 1))}
                        />
                        <b>{i + 1}</b>
                        <span>{s}</span>
                      </label>
                    ))}
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

          <div className="form-actions">
            {step > 0 && (
              <button className="back-button" onClick={() => setStep(s => s - 1)}>← Atrás</button>
            )}
            <button className="next-button" onClick={step === 4 ? submit : next} disabled={submitting}>
              {submitting ? 'Calculando tu resultado…' : step === 4 ? 'Ver mi resultado' : 'Siguiente →'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
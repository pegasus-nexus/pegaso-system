import type { Dimension, Question } from '../types/assessment';

export const dimensions: Dimension[] = [
  { code: 'DIR', name: 'Dirección y modelo de negocio' },
  { code: 'CLI', name: 'Clientes, mercado y ventas' },
  { code: 'PRO', name: 'Procesos y operaciones' },
  { code: 'PER', name: 'Organización y personas' },
  { code: 'FIN', name: 'Gestión financiera y desempeño' },
  { code: 'DAT', name: 'Información y tecnología' },
  { code: 'CRE', name: 'Análisis, automatización y crecimiento' }
];

export const questions: Question[] = [
  // DIMENSIÓN 1. DIRECCIÓN Y MODELO DE NEGOCIO
  { id: 'DIR-01', dimensionCode: 'DIR', question: 'La empresa tiene claramente definido qué productos o servicios ofrece, qué necesidades resuelve y a qué clientes se dirige.' },
  { id: 'DIR-02', dimensionCode: 'DIR', question: 'La empresa conoce cuáles de sus productos, servicios o líneas de negocio generan la mayor parte de sus ingresos y rentabilidad.' },
  { id: 'DIR-03', dimensionCode: 'DIR', question: 'La empresa posee una propuesta de valor clara que la diferencia de sus principales competidores.' },
  { id: 'DIR-04', dimensionCode: 'DIR', question: 'La empresa ha definido objetivos concretos para orientar su crecimiento durante los próximos doce meses.' },
  { id: 'DIR-05', dimensionCode: 'DIR', question: 'Las decisiones importantes se toman considerando información del negocio, riesgos, oportunidades y resultados esperados.' },

  // DIMENSIÓN 2. CLIENTES, MERCADO Y VENTAS
  { id: 'CLI-01', dimensionCode: 'CLI', question: 'La empresa tiene claramente identificados y segmentados sus principales tipos de clientes.' },
  { id: 'CLI-02', dimensionCode: 'CLI', question: 'La empresa conoce cuáles son los canales que generan más clientes y ventas.' },
  { id: 'CLI-03', dimensionCode: 'CLI', question: 'La empresa realiza acciones planificadas para captar nuevos clientes y convertir oportunidades en ventas.' },
  { id: 'CLI-04', dimensionCode: 'CLI', question: 'La empresa realiza acciones sistemáticas para mantener, fidelizar y aumentar las compras de sus clientes actuales.' },
  { id: 'CLI-05', dimensionCode: 'CLI', question: 'La empresa mide la satisfacción, las necesidades y la experiencia de sus clientes mediante información verificable.' },

  // DIMENSIÓN 3. PROCESOS Y OPERACIONES
  { id: 'PRO-01', dimensionCode: 'PRO', question: 'Las actividades críticas para entregar los productos o servicios están claramente identificadas.' },
  { id: 'PRO-02', dimensionCode: 'PRO', question: 'Los principales procesos operativos se realizan siguiendo procedimientos, criterios o secuencias previamente definidos.' },
  { id: 'PRO-03', dimensionCode: 'PRO', question: 'La empresa controla tiempos, costos, calidad y cumplimiento en sus principales operaciones.' },
  { id: 'PRO-04', dimensionCode: 'PRO', question: 'Los errores, retrasos, reclamos o fallas operativas se registran, analizan y corrigen.' },
  { id: 'PRO-05', dimensionCode: 'PRO', question: 'La empresa revisa y mejora periódicamente sus procesos para aumentar la productividad y reducir desperdicios.' },

  // DIMENSIÓN 4. ORGANIZACIÓN Y PERSONAS
  { id: 'PER-01', dimensionCode: 'PER', question: 'Las funciones, responsabilidades y niveles de autoridad de cada integrante de la empresa están claramente definidos.' },
  { id: 'PER-02', dimensionCode: 'PER', question: 'Las actividades importantes pueden continuar aunque el propietario o una persona clave no esté presente.' },
  { id: 'PER-03', dimensionCode: 'PER', question: 'La empresa planifica sus necesidades de personal de acuerdo con el volumen de trabajo y sus objetivos de crecimiento.' },
  { id: 'PER-04', dimensionCode: 'PER', question: 'Los colaboradores reciben capacitación, orientación y retroalimentación para mejorar su desempeño.' },
  { id: 'PER-05', dimensionCode: 'PER', question: 'Existe coordinación y comunicación efectiva entre las personas o áreas que participan en la operación.' },

  // DIMENSIÓN 5. GESTIÓN FINANCIERA Y DESEMPEÑO
  { id: 'FIN-01', dimensionCode: 'FIN', question: 'La empresa registra de manera ordenada y actualizada sus ventas, costos, gastos, cobros y pagos.' },
  { id: 'FIN-02', dimensionCode: 'FIN', question: 'La empresa conoce el costo y el margen de ganancia de sus principales productos o servicios.' },
  { id: 'FIN-03', dimensionCode: 'FIN', question: 'La empresa controla su flujo de efectivo y anticipa sus necesidades de liquidez.' },
  { id: 'FIN-04', dimensionCode: 'FIN', question: 'La empresa utiliza indicadores para evaluar periódicamente sus ventas, rentabilidad, costos y desempeño general.' },
  { id: 'FIN-05', dimensionCode: 'FIN', question: 'La información financiera se utiliza para tomar decisiones sobre precios, inversiones, gastos y crecimiento.' },

  // DIMENSIÓN 6. INFORMACIÓN Y TECNOLOGÍA
  { id: 'DAT-01', dimensionCode: 'DAT', question: 'La información de clientes, ventas, productos, inventarios, proveedores y operaciones se registra de manera organizada.' },
  { id: 'DAT-02', dimensionCode: 'DAT', question: 'La empresa cuenta con criterios definidos para asegurar que sus datos sean completos, correctos y estén actualizados.' },
  { id: 'DAT-03', dimensionCode: 'DAT', question: 'Las personas responsables pueden acceder oportunamente a la información que necesitan para realizar su trabajo.' },
  { id: 'DAT-04', dimensionCode: 'DAT', question: 'La empresa utiliza sistemas o herramientas digitales adecuadas para apoyar sus principales procesos.' },
  { id: 'DAT-05', dimensionCode: 'DAT', question: 'Los sistemas, archivos y herramientas digitales cuentan con controles de acceso, respaldos y medidas básicas de seguridad.' },

  // DIMENSIÓN 7. ANÁLISIS, AUTOMATIZACIÓN Y CRECIMIENTO
  { id: 'CRE-01', dimensionCode: 'CRE', question: 'La empresa utiliza reportes, indicadores o tableros para analizar su desempeño y detectar problemas u oportunidades.' },
  { id: 'CRE-02', dimensionCode: 'CRE', question: 'La empresa identifica tareas repetitivas que podrían simplificarse o automatizarse mediante tecnología.' },
  { id: 'CRE-03', dimensionCode: 'CRE', question: 'Las herramientas tecnológicas utilizadas por la empresa están integradas o permiten compartir información sin duplicar innecesariamente el trabajo.' },
  { id: 'CRE-04', dimensionCode: 'CRE', question: 'La empresa evalúa nuevas tecnologías, incluida la inteligencia artificial, según su utilidad y capacidad para resolver necesidades reales.' },
  { id: 'CRE-05', dimensionCode: 'CRE', question: 'La empresa cuenta con procesos, recursos y capacidades que le permitirían aumentar sus ventas u operaciones sin perder control, calidad o rentabilidad.' }
];

export const likertScale = [
  { value: 1, description: 'No existe o no se realiza.' },
  { value: 2, description: 'Se realiza ocasionalmente y de manera informal.' },
  { value: 3, description: 'Está parcialmente definido o implementado.' },
  { value: 4, description: 'Está formalmente implementado y se aplica regularmente.' },
  { value: 5, description: 'Está implementado, se mide y mejora continuamente.' }
];

-- Tabla para guardar los resultados de la Evaluación de Capacidades (ruta /capacidades)
CREATE TABLE IF NOT EXISTS public.assessment_capacidades (
    -- Columnas base generadas automáticamente
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Código de evaluación generado para el lead
    lead_id text,

    -- Datos de contacto (Paso 5)
    name text NOT NULL,
    company text NOT NULL,
    email text NOT NULL,
    phone text,
    city text,

    -- Respuestas completas (JSON de P01 a P20)
    responses jsonb,

    -- Resultado orientativo
    result_index numeric,
    band text,
    dimensions jsonb,
    strength text,
    priority text,
    message text
);

-- Permite inserción anónima desde la API pública del navegador
ALTER TABLE public.assessment_capacidades DISABLE ROW LEVEL SECURITY;

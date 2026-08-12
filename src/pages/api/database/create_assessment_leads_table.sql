-- Tabla para guardar los leads y resultados de Pegasus Assessment
CREATE TABLE IF NOT EXISTS public.assessment_leads (
    -- Columnas base generadas automáticamente
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Datos de la empresa (Pantalla 2)
    company_name text NOT NULL,
    contact_name text NOT NULL,
    role text,
    email text NOT NULL,
    phone text,
    city text,
    country text,
    sector text,
    employee_count text,
    years_in_business text,
    
    -- Resultados de la evaluación
    total_score integer NOT NULL,
    maturity_index numeric NOT NULL,
    level integer NOT NULL,
    level_name text NOT NULL,
    open_question_answer text
);

-- Para este caso donde no tenemos un sistema de inicio de sesión configurado para los usuarios finales,
-- deshabilitamos el "Row Level Security (RLS)" para que la base de datos permita recibir los datos
-- de forma anónima desde nuestra API pública.
ALTER TABLE public.assessment_leads DISABLE ROW LEVEL SECURITY;

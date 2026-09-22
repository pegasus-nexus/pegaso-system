import type { APIRoute } from 'astro';
import postgres from 'postgres';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar que la variable de entorno exista
    const dbUrl = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL is not defined in environment variables.");
    }

    // Inicializar el cliente
    const sql = postgres(dbUrl, { ssl: 'require' });

    // Parsear el cuerpo de la solicitud
    const body = await request.json();

    // Insertar en la base de datos
    const result = await sql`
      INSERT INTO assessment_leads (
        company_name, contact_name, role, email, phone, city, country, 
        sector, employee_count, years_in_business, total_score, maturity_index, 
        level, level_name, open_question_answer, responses,
        user_agent, utm_source, utm_medium, utm_campaign, 
        session_duration_seconds, company_domain, data_processing_consent
      ) VALUES (
        ${body.company_name}, ${body.contact_name}, ${body.role || null}, ${body.email}, 
        ${body.phone || null}, ${body.city || null}, ${body.country || null}, 
        ${body.sector || null}, ${body.employee_count || null}, ${body.years_in_business || null}, 
        ${body.total_score}, ${body.maturity_index}, 
        ${body.level}, ${body.level_name}, ${body.open_question_answer || null}, ${body.responses ? sql.json(body.responses) : null},
        ${body.user_agent || null}, ${body.utm_source || null}, ${body.utm_medium || null}, ${body.utm_campaign || null}, 
        ${body.session_duration_seconds || null}, ${body.company_domain || null}, ${body.data_processing_consent || false}
      )
      RETURNING id;
    `;

    // Cerrar la conexión (opcional en serverless, pero buena práctica si no se usa pool persistente largo)
    // await sql.end();

    return new Response(JSON.stringify({ success: true, id: result[0].id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Error saving assessment:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

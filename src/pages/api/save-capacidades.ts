import type { APIRoute } from 'astro';
import postgres from 'postgres';

export const POST: APIRoute = async ({ request }) => {
  try {
    const dbUrl = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL is not defined in environment variables.");
    }

    const sql = postgres(dbUrl, { ssl: 'require' });
    const body = await request.json();

    const result = await sql`
      INSERT INTO assessment_capacidades (
        lead_id, name, company, email, phone, city, 
        responses, result_index, band, dimensions, strength, priority, message,
        user_agent, utm_source, utm_medium, utm_campaign, 
        session_duration_seconds, company_domain, data_processing_consent
      ) VALUES (
        ${body.lead_id || null}, ${body.name}, ${body.company}, ${body.email}, ${body.phone || null}, ${body.city || null}, 
        ${body.responses ? sql.json(body.responses) : null}, ${body.result_index}, ${body.band}, 
        ${body.dimensions ? sql.json(body.dimensions) : null}, ${body.strength || null}, ${body.priority || null}, ${body.message || null},
        ${body.user_agent || null}, ${body.utm_source || null}, ${body.utm_medium || null}, ${body.utm_campaign || null}, 
        ${body.session_duration_seconds || null}, ${body.company_domain || null}, ${body.data_processing_consent || false}
      )
      RETURNING id;
    `;

    return new Response(JSON.stringify({ success: true, id: result[0].id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Error saving capacidades assessment:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

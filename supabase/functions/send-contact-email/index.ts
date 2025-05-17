import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://costumecameos.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // ✅ Respond to CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
      },
    });
  }

  // ❌ Block everything else except POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { senderName, senderEmail, message, recipientEmail } = await req.json();

    const smtp = new SmtpClient({
      host: Deno.env.get('SMTP_HOST') || '',
      port: Number(Deno.env.get('SMTP_PORT')) || 587,
      secure: true,
      auth: {
        user: Deno.env.get('SMTP_USER') || '',
        pass: Deno.env.get('SMTP_PASS') || '',
      },
    });

    await smtp.sendMail({
      from: `"CostumeCameos" <noreply@costumecameos.com>`,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: `New Contact Message from ${senderName}`,
      text: `${message}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Email send error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://costumecameos.com/',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('OK', { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
      },
      status: 200 
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { senderName, senderEmail, message, recipientEmail } = await req.json();

    if (!senderName || !senderEmail || !message || !recipientEmail) {
      throw new Error('Missing required fields');
    }

    const smtp = new SmtpClient({
      host: Deno.env.get('SMTP_HOST'),
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      secure: true,
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASS'),
      },
    });

    await smtp.sendMail({
      from: `"CostumeCameos" <noreply@costumecameos.com>`,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: `New Contact Message from ${senderName}`,
      text: `From: ${senderName} <${senderEmail}>\n\n${message}`,
      html: `
        <h2>New Message from ${senderName}</h2>
        <p><strong>From:</strong> ${senderName} &lt;${senderEmail}&gt;</p>
        <hr>
        <div style="white-space: pre-wrap;">${message}</div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while sending the message'
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: error.message === 'Method not allowed' ? 405 : 500
      }
    );
  }
});
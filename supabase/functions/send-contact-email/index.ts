import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "npm:emailjs-smtp-client@2.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://costumecameos.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // ✅ Handle CORS preflight.
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain',
      }
    });
  }

  // ❌ Block everything except POST here  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { senderName, senderEmail, message, recipientEmail } = await req.json();

    // ✅ Basic field validation
    if (!senderName || !senderEmail || !message || !recipientEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // ✅ Email format validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // ✅ Set up SMTP clients
    const client = new SmtpClient(
      Deno.env.get('SMTP_HOST') || '',
      Number(Deno.env.get('SMTP_PORT')) || 587,
      {
        auth: {
          user: Deno.env.get('SMTP_USER') || '',
          pass: Deno.env.get('SMTP_PASS') || '',
        },
        useSecureTransport: Number(Deno.env.get('SMTP_PORT')) === 465,
        requireTLS: Number(Deno.env.get('SMTP_PORT')) === 587,
      }
    );

    const emailContent = `From: "CostumeCameos" <noreply@costumecameos.com>
Reply-To: ${senderEmail}
To: ${recipientEmail}
Subject: New Message from ${senderName} via CostumeCameos
Content-Type: text/plain; charset=utf-8

New Contact Message

From: ${senderName} (${senderEmail})

Message:
${message}

This message was sent through CostumeCameos. You can reply directly to this email to respond to ${senderName}.`;

    // ✅ Send email
    await client.connect();
    await client.send({
      from: 'noreply@costumecameos.com',
      to: recipientEmail,
      data: emailContent,
    });
    await client.quit();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email', details: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

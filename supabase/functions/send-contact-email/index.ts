import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "npm:smtp-client@0.4.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405,
        headers: corsHeaders
      }
    );
  }

  try {
    const { senderName, senderEmail, message, recipientEmail } = await req.json();

    // Validate required fields
    if (!senderName || !senderEmail || !message || !recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const smtp = new SMTPClient({
      host: Deno.env.get('SMTP_HOST') || '',
      port: Number(Deno.env.get('SMTP_PORT')) || 587,
      secure: Number(Deno.env.get('SMTP_PORT')) === 465,
      username: Deno.env.get('SMTP_USER') || '',
      password: Deno.env.get('SMTP_PASS') || '',
    });

    // Connect to SMTP server
    await smtp.connect();
    
    // Send email
    await smtp.mail({ from: 'noreply@costumecameos.com' });
    await smtp.rcpt({ to: recipientEmail });
    
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

    await smtp.data(emailContent);
    await smtp.quit();

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }), 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
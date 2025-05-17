import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "npm:nodemailer";

// Define CORS headers that work for both development and production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins in development
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  try {
    const { senderName, senderEmail, message, recipientEmail } = await req.json();

    // Validate required fields
    if (!senderName || !senderEmail || !message || !recipientEmail) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: {
            senderName: !senderName,
            senderEmail: !senderEmail,
            message: !message,
            recipientEmail: !recipientEmail
          }
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid email format',
          details: {
            senderEmail: !emailRegex.test(senderEmail),
            recipientEmail: !emailRegex.test(recipientEmail)
          }
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Get SMTP credentials from environment variables
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Deno.env.get('SMTP_PORT');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    // Validate SMTP configuration
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('Missing SMTP configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Create SMTP client
    const smtp = new SmtpClient({
      host: smtpHost,
      port: Number(smtpPort),
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email
    await smtp.sendMail({
      from: `"CostumeCameos" <noreply@costumecameos.com>`,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: `New Contact Message from ${senderName}`,
      text: `You have received a new message through CostumeCameos:

From: ${senderName} (${senderEmail})

Message:
${message}

---
This message was sent through CostumeCameos. You can reply directly to this email to contact ${senderName}.`,
      html: `
        <h2>You have received a new message through CostumeCameos</h2>
        <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
        <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p style="color: #666; font-size: 0.9em;">
          This message was sent through CostumeCameos. You can reply directly to this email to contact ${senderName}.
        </p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
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
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
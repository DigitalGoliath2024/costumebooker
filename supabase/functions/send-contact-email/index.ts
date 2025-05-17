import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "https://esm.sh/nodemailer@6.9.18";

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

    // Create SMTP transport with more flexible configuration
    const smtp = nodemailer.createTransport({
      host: Deno.env.get('SMTP_HOST'),
      port: Number(Deno.env.get('SMTP_PORT')) || 587,
      secure: Number(Deno.env.get('SMTP_PORT')) === 465, // Only use secure for port 465
      auth: {
        user: Deno.env.get('SMTP_USER'),
        pass: Deno.env.get('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });

    // Send email with HTML format
    await smtp.sendMail({
      from: `"CostumeCameos" <noreply@costumecameos.com>`,
      to: recipientEmail,
      replyTo: senderEmail,
      subject: `New Message from ${senderName} via CostumeCameos`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568;">New Contact Message</h2>
          <p style="color: #718096;"><strong>From:</strong> ${senderName} (${senderEmail})</p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #4a5568; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #718096; font-size: 14px;">
            This message was sent through CostumeCameos. You can reply directly to this email to respond to ${senderName}.
          </p>
        </div>
      `,
      text: `
New Contact Message

From: ${senderName} (${senderEmail})

Message:
${message}

This message was sent through CostumeCameos. You can reply directly to this email to respond to ${senderName}.
      `.trim(),
    });

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
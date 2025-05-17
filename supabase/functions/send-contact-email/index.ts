import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Prepare email content
    const emailContent = {
      personalizations: [{
        to: [{ email: recipientEmail }],
        subject: `New Message from ${senderName} via CostumeCameos`
      }],
      from: { email: "noreply@costumecameos.com", name: "CostumeCameos" },
      reply_to: { email: senderEmail, name: senderName },
      content: [{
        type: "text/html",
        value: `
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
        `
      }]
    };

    // Send email using SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailContent)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${error}`);
    }

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
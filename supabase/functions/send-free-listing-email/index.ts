import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Processing POST request');

    // Log SMTP configuration
    console.log('SMTP Configuration:', {
      host: Deno.env.get('SMTP_HOST'),
      port: Deno.env.get('SMTP_PORT'),
      user: Deno.env.get('SMTP_USER'),
      // Don't log password
      hasPassword: !!Deno.env.get('SMTP_PASS')
    });

    // Parse form data
    console.log('Parsing form data');
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    
    // Log parsed data (excluding sensitive info)
    console.log('Parsed form data:', {
      ...data,
      email: '[REDACTED]',
      phone: '[REDACTED]'
    });

    // Validate SMTP credentials
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Number(Deno.env.get('SMTP_PORT'));
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('Missing SMTP credentials:', {
        hasHost: !!smtpHost,
        hasPort: !!smtpPort,
        hasUser: !!smtpUser,
        hasPass: !!smtpPass
      });
      throw new Error('Missing SMTP credentials');
    }

    console.log('Initializing SMTP client');
    
    // Set up SMTP client
    const client = new SmtpClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: smtpPort === 465,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    // Format email content
    console.log('Formatting email content');
    const emailContent = `
New Free Listing Application

Basic Info:
-----------
Full Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

Location:
---------
City: ${data.city}
State: ${data.state}

Social Media:
------------
Instagram: ${data.instagram || 'Not provided'}
Facebook: ${data.facebook || 'Not provided'}
YouTube: ${data.youtube || 'Not provided'}
TikTok: ${data.tiktok || 'Not provided'}
Website: ${data.website || 'Not provided'}

Experience:
----------
Years of Experience: ${data.experience}
Paid Events: ${data.paidEvents}
Event Types: ${data.eventTypes || 'Not provided'}
Characters: ${data.characters || 'Not provided'}

Bio:
----
${data.bio}

Travel:
-------
Travel Availability: ${data.travel}

Additional Info:
---------------
Why Join: ${data.whyJoin || 'Not provided'}
Questions/Notes: ${data.questions || 'Not provided'}
    `;

    try {
      console.log('Attempting to send email');
      await client.send({
        from: 'noreply@costumecameos.com',
        to: 'support@costumecameos.com',
        subject: `New Free Listing Application - ${data.fullName}`,
        content: emailContent,
        html: emailContent.replace(/\n/g, '<br>'),
      });

      console.log('Email sent successfully');
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error('SMTP error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to send email: ${error.message}`);
    } finally {
      console.log('Closing SMTP client');
      await client.close();
    }
  } catch (error) {
    console.error('Error processing request:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return new Response(JSON.stringify({ 
      error: 'Failed to process application', 
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
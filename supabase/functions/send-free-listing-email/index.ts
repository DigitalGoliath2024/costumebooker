import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { multiParser } from 'https://deno.land/x/multiparser@0.114.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://costumecameos.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
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

    // Validate SMTP configuration
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Number(Deno.env.get('SMTP_PORT'));
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    console.log('SMTP Configuration:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      hasPassword: !!smtpPass
    });

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('Missing SMTP credentials');
      throw new Error('Server configuration error');
    }

    // Parse multipart form data
    console.log('Parsing form data');
    const formData = await multiParser(req);
    console.log('Form data parsed:', {
      fields: Object.keys(formData.fields),
      files: formData.files?.length || 0
    });

    const data = formData.fields;
    
    if (!data.fullName || !data.email) {
      console.error('Missing required fields');
      throw new Error('Missing required fields');
    }

    // Initialize SMTP client
    console.log('Initializing SMTP client');
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
      console.log('Sending email');
      await client.send({
        from: 'noreply@costumecameos.com',
        to: 'support@costumecameos.com',
        subject: `New Free Listing Application - ${data.fullName}`,
        content: emailContent,
        html: emailContent.replace(/\n/g, '<br>'),
      });

      console.log('Email sent successfully');
    } catch (error) {
      console.error('SMTP error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    } finally {
      await client.close();
      console.log('SMTP client closed');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process application', 
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
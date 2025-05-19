import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { multiParser } from 'https://deno.land/x/multiparser@0.114.0/mod.ts';

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

    // Parse form data
    console.log('Parsing form data');
    const formData = await req.formData();
    console.log('Form data parsed:', {
      fields: Array.from(formData.entries()).map(([key]) => key)
    });

    // Extract form fields
    const data = Object.fromEntries(formData.entries());
    
    if (!data.fullName || !data.email) {
      console.error('Missing required fields');
      throw new Error('Missing required fields');
    }

    // Get Mailgun credentials
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');

    if (!mailgunDomain || !mailgunApiKey) {
      console.error('Missing Mailgun credentials');
      throw new Error('Missing Mailgun credentials');
    }

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

    const htmlContent = emailContent.replace(/\n/g, '<br>');

    // Send email via Mailgun API
    console.log('Sending email via Mailgun');
    
    const mailgunUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;
    const emailFormData = new FormData();
    emailFormData.append('from', `CostumeCameos <noreply@${mailgunDomain}>`);
    emailFormData.append('to', 'support@costumecameos.com');
    emailFormData.append('subject', `New Free Listing Application - ${data.fullName}`);
    emailFormData.append('text', emailContent);
    emailFormData.append('html', htmlContent);

    const mailgunResponse = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
      },
      body: emailFormData,
    });

    if (!mailgunResponse.ok) {
      const mailgunError = await mailgunResponse.json();
      console.error('Mailgun API error:', mailgunError);
      throw new Error(`Failed to send email: ${mailgunError.message}`);
    }

    console.log('Email sent successfully');

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
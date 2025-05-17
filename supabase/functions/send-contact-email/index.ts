import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SmtpClient } from "npm:emailjs-smtp-client@2.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('OK', { 
      status: 200,
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { senderName, senderEmail, message, recipientEmail, profileId } = await req.json();

    // Validate required fields
    if (!senderName || !senderEmail || !message || !recipientEmail || !profileId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // Store message in database
    const { error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert({
        profile_id: profileId,
        sender_name: senderName,
        sender_email: senderEmail,
        message: message,
        is_read: false,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Validate SMTP credentials
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Number(Deno.env.get('SMTP_PORT'));
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      throw new Error('Missing SMTP credentials');
    }

    // Set up SMTP client
    const client = new SmtpClient(smtpHost, smtpPort, {
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      useSecureTransport: smtpPort === 465,
      requireTLS: smtpPort === 587,
    });

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

    try {
      await client.connect();
      await client.send({
        from: 'noreply@costumecameos.com',
        to: recipientEmail,
        data: emailContent,
      });
      await client.quit();
    } catch (emailError) {
      console.error('SMTP error:', emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email', 
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
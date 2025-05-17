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
    // Log request start
    console.log('Processing contact form submission');

    const requestData = await req.json();
    console.log('Received data:', {
      ...requestData,
      message: '[REDACTED]' // Don't log the actual message content
    });

    const { senderName, senderEmail, message, recipientEmail, profileId } = requestData;

    // Validate required fields
    if (!senderName || !senderEmail || !message || !recipientEmail || !profileId) {
      console.log('Missing required fields:', {
        hasSenderName: !!senderName,
        hasSenderEmail: !!senderEmail,
        hasMessage: !!message,
        hasRecipientEmail: !!recipientEmail,
        hasProfileId: !!profileId
      });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(recipientEmail)) {
      console.log('Invalid email format:', { senderEmail, recipientEmail });
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Missing Supabase credentials');
    }

    console.log('Initializing Supabase client');
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // Store message in database
    console.log('Storing message in database');
    const { data: insertData, error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert({
        profile_id: profileId,
        sender_name: senderName,
        sender_email: senderEmail,
        message: message,
        is_read: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint
      });
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Message stored successfully:', { messageId: insertData?.id });

    // Validate SMTP credentials
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = Number(Deno.env.get('SMTP_PORT'));
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('Missing SMTP credentials');
      throw new Error('Missing SMTP credentials');
    }

    console.log('Sending email via SMTP');
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
      console.log('Email sent successfully');
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
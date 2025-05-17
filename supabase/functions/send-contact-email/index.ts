import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SMTPClient } from 'npm:smtp-client@0.4.0';

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

    // Store the message in the database first
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );

    const { error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert({
        sender_name: senderName,
        sender_email: senderEmail,
        message: message,
        profile_id: profileId, // Now correctly using the profile ID instead of email
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to store message in database: ${dbError.message}`);
    }

    // Set up SMTP client
    const client = new SMTPClient({
      host: Deno.env.get('SMTP_HOST') || '',
      port: Number(Deno.env.get('SMTP_PORT')) || 587,
      username: Deno.env.get('SMTP_USER') || '',
      password: Deno.env.get('SMTP_PASS') || '',
      secure: true,
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

    // Send email
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
    return new Response(JSON.stringify({ 
      error: 'Failed to send email', 
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
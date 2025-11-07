import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const password = formData.get('password');

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward request to CAS Parser API
    const casParserFormData = new FormData();
    casParserFormData.append('file', file);
    
    if (password) {
      casParserFormData.append('password', password);
    }

    const response = await fetch('https://api.casparser.in/v1/parse', {
      method: 'POST',
      body: casParserFormData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('CAS Parser API returned an error:', response.status, responseData); // Added logging
      return new Response(
        JSON.stringify({ error: responseData.error || 'Failed to parse document', status: response.status }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(responseData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error parsing CAS:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
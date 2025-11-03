import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DigestRequest {
  userId: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email }: DigestRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's watchlist
    const { data: watchlist, error: watchlistError } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", userId);

    if (watchlistError) throw watchlistError;

    // Calculate portfolio metrics
    const totalValue = watchlist?.reduce((sum, item) => sum + Number(item.current_nav), 0) || 0;
    const avgChange = watchlist?.reduce((sum, item) => sum + Number(item.change_percentage), 0) / (watchlist?.length || 1) || 0;
    
    // Get top performers
    const topGainers = watchlist?.sort((a, b) => Number(b.change_percentage) - Number(a.change_percentage)).slice(0, 3) || [];

    // In production, integrate with Resend for email sending
    // For now, we'll just return the digest data
    const digestData = {
      totalValue: totalValue.toFixed(2),
      avgChange: avgChange.toFixed(2),
      topGainers: topGainers.map(item => ({
        name: item.scheme_name,
        change: Number(item.change_percentage).toFixed(2)
      })),
      watchlistCount: watchlist?.length || 0
    };

    console.log("Weekly digest generated for:", email, digestData);

    return new Response(
      JSON.stringify({ success: true, digest: digestData }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error generating weekly digest:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

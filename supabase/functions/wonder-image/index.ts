// Wonder Image — kid-safe illustration for a Curio section, on demand.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        modalities: ["image", "text"],
        messages: [{
          role: "user",
          content: `${prompt}. Bright, friendly children's book illustration, bold shapes, deep indigo and violet night palette with mint highlights, no text, no words, no letters.`,
        }],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("image gateway", res.status, t);
      const status = res.status === 429 ? 429 : res.status === 402 ? 402 : 500;
      return new Response(JSON.stringify({
        error: status === 429 ? "Too many pictures at once — try again shortly."
          : status === 402 ? "AI credits exhausted. Please add credits."
          : "Could not draw that picture.",
      }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await res.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "No image returned" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

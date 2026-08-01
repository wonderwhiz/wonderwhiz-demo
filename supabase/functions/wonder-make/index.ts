// Wonder Make — the Make Mode brief that closes every Curio.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SCHEMA = {
  type: "object",
  properties: {
    kind: {
      type: "string",
      enum: ["comic", "story", "poster", "quiz", "explainer", "project"],
    },
    title: { type: "string", description: "Name of the make, max 6 words" },
    emoji: { type: "string" },
    brief: { type: "string", description: "One sentence telling the child what to make. Max 25 words." },
    steps: {
      type: "array",
      description: "3 or 4 tiny steps, each under 14 words",
      items: { type: "string" },
    },
    materials: {
      type: "array",
      description: "Simple household materials, or an empty array for screen-only makes",
      items: { type: "string" },
    },
  },
  required: ["kind", "title", "emoji", "brief", "steps", "materials"],
  additionalProperties: false,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { topic, childAge = 10, childName, mood = "explore" } = await req.json();
    const age = Math.min(16, Math.max(5, Number(childAge) || 10));

    const system = `You are Wonder, a child educator inventing a "Make Mode" finale for a ${age}-year-old${childName ? ` named ${childName}` : ""} who just learned about "${topic}".
Their mood today is "${mood}" — pick a make that fits it (build = hands-on project, calm = gentle drawing or story, challenge = quiz or explainer, explore = comic or poster).
It must be finishable in 15 minutes with things at home, and it must PROVE they understood the topic.
Return ONLY JSON matching the schema.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Topic: ${topic}` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "make", strict: true, schema: SCHEMA },
        },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("gateway", res.status, t);
      const status = res.status === 429 ? 429 : res.status === 402 ? 402 : 500;
      return new Response(JSON.stringify({
        error: status === 429 ? "Try again in a moment."
          : status === 402 ? "AI credits exhausted. Please add credits."
          : "Could not build that challenge.",
      }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

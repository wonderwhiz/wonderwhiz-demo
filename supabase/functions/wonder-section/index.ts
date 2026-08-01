// Wonder Section — one Deep Dive section at a time, with an optional
// checkpoint (quiz / flip card / myth-vs-fact / riddle).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

function voiceFor(age: number) {
  if (age <= 7) return "Max 10 words per sentence. Everyday comparisons. No jargon.";
  if (age <= 11) return "Curious-friend tone, one vivid analogy, sentences under 16 words.";
  return "Respectful and precise. Real terms defined on first use.";
}

const SCHEMA = {
  type: "object",
  properties: {
    heading: { type: "string", description: "Max 5 words" },
    emoji: { type: "string" },
    body: {
      type: "array",
      description: "Exactly 2 or 3 SHORT sentences. Each under 20 words. No fluff.",
      items: { type: "string" },
    },
    image_prompt: { type: "string", description: "Kid-friendly illustration prompt for this section" },
    story: { type: "string", description: "A 3-sentence mini story that explains this same idea" },
    checkpoint: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["quiz", "flip", "myth", "riddle"] },
        prompt: { type: "string", description: "Question, flip-card front, the myth statement, or the riddle" },
        options: { type: "array", items: { type: "string" }, description: "3-4 options for quiz/myth (myth uses ['Myth','Fact']); empty array otherwise" },
        correct_index: { type: "integer", description: "Index of correct option, or -1 when not applicable" },
        answer: { type: "string", description: "Flip-card back / riddle answer, empty string when not applicable" },
        explanation: { type: "string", description: "One friendly sentence explaining why" },
      },
      required: ["kind", "prompt", "options", "correct_index", "answer", "explanation"],
      additionalProperties: false,
    },
  },
  required: ["heading", "emoji", "body", "image_prompt", "story", "checkpoint"],
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
    const {
      topic, question, sectionTitle, index = 0, total = 4,
      childAge = 10, childName, mood = "explore", kind = "quiz",
    } = await req.json();

    const age = Math.min(16, Math.max(5, Number(childAge) || 10));

    const system = `You are Wonder, a child educator writing ONE small screen of a Deep Dive for a ${age}-year-old${childName ? ` named ${childName}` : ""}.
Voice: ${voiceFor(age)}
This is section ${Number(index) + 1} of ${total} in the Curio "${topic}" (their question: "${question}").
Write ONLY this section: "${sectionTitle}". Never recap other sections. Never say "in this section".
Body must be 2-3 short sentences MAX — this is a phone screen, not an article.
The checkpoint MUST be of kind "${kind}" and must be answerable purely from the body you just wrote.
Everything true and age-safe. Return ONLY JSON matching the schema.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Section: ${sectionTitle}` },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "section", strict: true, schema: SCHEMA },
        },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("gateway", res.status, t);
      const status = res.status === 429 ? 429 : res.status === 402 ? 402 : 500;
      return new Response(JSON.stringify({
        error: status === 429 ? "Slow down a little — try again in a moment."
          : status === 402 ? "AI credits exhausted. Please add credits."
          : "Could not open that section.",
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

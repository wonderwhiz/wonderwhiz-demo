// Wonder Spark — the instant, tiny first answer for a Curio.
// Returns a ~40 word playful answer, one surprising fact, an image prompt,
// and the Table of Contents for the Deep Dive.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const MOODS: Record<string, string> = {
  explore: "Curious and wondrous. Lead with the most surprising angle.",
  build: "Hands-on and practical. Frame it like something you could make or do.",
  challenge: "Playfully competitive. Tease the tricky part and dare them to figure it out.",
  calm: "Gentle, slow, soothing. Soft imagery, no exclamation marks.",
};

function voiceFor(age: number) {
  if (age <= 7) return "Max 10 words per sentence. Compare to toys, food, animals, weather. No jargon.";
  if (age <= 11) return "Curious-friend tone, one vivid analogy, sentences under 16 words.";
  return "Respectful and precise. Real terms, defined on first use. No baby talk.";
}

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "Short punchy Curio title, max 6 words" },
    emoji: { type: "string", description: "One emoji for the topic" },
    answer: { type: "string", description: "The Spark Answer. MAX 40 words. Playful, direct." },
    wow_fact: { type: "string", description: "One surprising true fact, max 20 words" },
    image_prompt: { type: "string", description: "Illustration prompt for a colourful kid-friendly picture" },
    sections: {
      type: "array",
      description: "Exactly 4 deep dive sections, ordered simple to mind-blowing",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Max 5 words" },
          emoji: { type: "string" },
        },
        required: ["title", "emoji"],
        additionalProperties: false,
      },
    },
    predict: {
      type: "object",
      description: "A fun guess-first question asked BEFORE revealing the answer. Must be answerable by a hunch, never require prior knowledge.",
      properties: {
        prompt: { type: "string", description: "Max 14 words, starts with 'Guess:' style curiosity" },
        options: {
          type: "array",
          description: "Exactly 2 short, playful options, max 6 words each",
          items: { type: "string" },
        },
        correct_index: { type: "number", description: "0 or 1" },
        reveal: { type: "string", description: "One warm sentence explaining the true option, max 22 words" },
      },
      required: ["prompt", "options", "correct_index", "reveal"],
      additionalProperties: false,
    },
    rabbit_holes: {
      type: "array",
      description: "Exactly 3 irresistible follow-up questions a curious kid would ask next. Each a full question, max 8 words.",
      items: { type: "string" },
    },
  },
  required: ["title", "emoji", "answer", "wow_fact", "image_prompt", "sections", "predict", "rabbit_holes"],
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
    const { question, childAge = 10, childName, mood = "explore" } = await req.json();
    if (!question || !String(question).trim()) {
      return new Response(JSON.stringify({ error: "Question required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const age = Math.min(16, Math.max(5, Number(childAge) || 10));

    const system = `You are Wonder, a Cambridge-trained child educator writing for a ${age}-year-old${childName ? ` named ${childName}` : ""}.
Voice: ${voiceFor(age)}
Mood: ${MOODS[mood] ?? MOODS.explore}
The Spark Answer must satisfy instantly on its own — never say "let's find out" or "keep reading".
Everything must be true. If the question is unsafe or too adult, answer a wholesome nearby question instead.
Return ONLY JSON matching the schema.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: String(question) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "spark", strict: true, schema: SCHEMA },
        },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("gateway", res.status, t);
      const status = res.status === 429 ? 429 : res.status === 402 ? 402 : 500;
      return new Response(JSON.stringify({
        error: status === 429 ? "Whoa, so many questions! Try again in a moment."
          : status === 402 ? "AI credits exhausted. Please add credits."
          : "Could not spark that answer.",
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

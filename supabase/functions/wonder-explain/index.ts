// Wonder Explain — powers the reimagined encyclopedia.
// Uses Lovable AI Gateway. Returns a child-psychologist-tuned learning card.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface Body {
  question: string;
  childAge?: number;
  childName?: string;
  parentTopic?: string; // when going down a rabbit hole
}

function ageBand(age: number) {
  if (age <= 7) return {
    band: "5-7",
    voice: "Warm, playful, wondrous. Use very short sentences (max 12 words). Compare new ideas to things a young child already knows — toys, food, family, weather. No jargon. If a big word is essential, define it in the same sentence with 'which means…'.",
    paras: "2 short paragraphs, each 2-3 sentences.",
    vocab: 2,
    quizStyle: "One playful multiple choice with 3 options. Correct answer feels obvious once explained.",
  };
  if (age <= 11) return {
    band: "8-11",
    voice: "Curious-friend tone. Concrete examples, gentle humor, one vivid analogy per idea. Sentences under 18 words. Introduce one or two real terms but always define them.",
    paras: "3 short paragraphs.",
    vocab: 3,
    quizStyle: "One multiple choice with 4 options that rewards thinking, not memorizing.",
  };
  return {
    band: "12-16",
    voice: "Respectful, intellectually honest. Treat the learner as capable. Use precise language, real terminology defined on first use, and mention limits of current understanding when relevant.",
    paras: "3 paragraphs, richer detail, still tight prose.",
    vocab: 3,
    quizStyle: "One multiple choice with 4 options that tests conceptual understanding, not trivia.",
  };
}

const SYSTEM = (age: number, name?: string, parent?: string) => {
  const a = ageBand(age);
  return `You are Wonder, a Cambridge-trained child educator and developmental psychologist who writes for a ${age}-year-old${name ? ` named ${name}` : ""}. You honor curiosity: never condescending, never dry, never preachy.

WRITING RULES for age band ${a.band}:
- Voice: ${a.voice}
- Length: ${a.paras}
- Always open with a one-line "hook" that names what will feel magical about this answer.
- Facts must be genuinely surprising and true. No filler.
- Rabbit-hole questions must open new doors — not rephrase the topic. They should feel like "ooh, I want to know THAT next".
- Quiz: ${a.quizStyle} Include a one-sentence explanation of the correct answer.
- Vocabulary: ${a.vocab} key words with kid-friendly definitions.
${parent ? `- CONTEXT: The child is exploring "${parent}" and just asked a follow-up. Connect the answer back to that thread in the hook.` : ""}

SAFETY: If the question is unsafe, scary beyond age, or adult in nature, gently redirect with a related wholesome question instead. Never refuse coldly.

Return ONLY valid JSON matching the provided schema. No markdown, no prose outside JSON.`;
};

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "A punchy 3-6 word title" },
    hook: { type: "string", description: "One-sentence curiosity hook" },
    paragraphs: { type: "array", items: { type: "string" } },
    wow_facts: { type: "array", items: { type: "string" } },
    vocab: {
      type: "array",
      items: {
        type: "object",
        properties: {
          word: { type: "string" },
          meaning: { type: "string" },
        },
        required: ["word", "meaning"],
        additionalProperties: false,
      },
    },
    rabbit_holes: { type: "array", items: { type: "string" }, description: "4 follow-up questions" },
    quiz: {
      type: "object",
      properties: {
        question: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        correct_index: { type: "integer" },
        explanation: { type: "string" },
      },
      required: ["question", "options", "correct_index", "explanation"],
      additionalProperties: false,
    },
  },
  required: ["title", "hook", "paragraphs", "wow_facts", "vocab", "rabbit_holes", "quiz"],
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

    const body = (await req.json()) as Body;
    const question = (body.question || "").trim();
    if (!question) {
      return new Response(JSON.stringify({ error: "Question required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const age = Math.min(16, Math.max(5, body.childAge ?? 10));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          { role: "system", content: SYSTEM(age, body.childName, body.parentTopic) },
          { role: "user", content: question },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "wonder_card", strict: true, schema: SCHEMA },
        },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("Gateway error", res.status, t);
      const status = res.status === 429 ? 429 : res.status === 402 ? 402 : 500;
      const msg = status === 429 ? "Too many questions right now — try again in a moment."
        : status === 402 ? "AI credits exhausted. Please add credits."
        : "Failed to generate answer.";
      return new Response(JSON.stringify({ error: msg }), {
        status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    let card;
    try { card = JSON.parse(raw); }
    catch { card = JSON.parse(raw.replace(/```json|```/g, "").trim()); }

    return new Response(JSON.stringify({ card, question, age }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

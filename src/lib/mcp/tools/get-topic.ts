import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "./_supabase";

export default defineTool({
  name: "get_learning_topic",
  title: "Get learning topic with sections",
  description:
    "Fetch a single learning topic and its sections (title, content, facts) for one of the parent's children.",
  inputSchema: {
    topic_id: z.string().uuid().describe("Learning topic id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ topic_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const client = supabaseForUser(ctx);
    const { data: topic, error: tErr } = await client
      .from("learning_topics")
      .select("id, title, description, status, current_section, total_sections, child_id, child_age, table_of_contents, created_at, updated_at")
      .eq("id", topic_id)
      .maybeSingle();
    if (tErr) return { content: [{ type: "text", text: tErr.message }], isError: true };
    if (!topic) return { content: [{ type: "text", text: "Topic not found" }], isError: true };

    const { data: sections, error: sErr } = await client
      .from("learning_sections")
      .select("id, section_number, title, content, facts, word_count, image_url")
      .eq("topic_id", topic_id)
      .order("section_number", { ascending: true });
    if (sErr) return { content: [{ type: "text", text: sErr.message }], isError: true };

    const result = { topic, sections: sections ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});

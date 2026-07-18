import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "./_supabase";

export default defineTool({
  name: "list_learning_topics",
  title: "List learning topics",
  description:
    "List learning topics for one of the parent's children. Returns most recent first.",
  inputSchema: {
    child_id: z.string().uuid().describe("Child profile id (from list_child_profiles)."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ child_id, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("learning_topics")
      .select("id, title, description, status, current_section, total_sections, child_age, created_at, updated_at")
      .eq("child_id", child_id)
      .order("updated_at", { ascending: false })
      .limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { topics: data ?? [] },
    };
  },
});

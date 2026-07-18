import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listChildrenTool from "./tools/list-children";
import listTopicsTool from "./tools/list-topics";
import getTopicTool from "./tools/get-topic";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "wonderwhiz-mcp",
  title: "WonderWhiz",
  version: "0.1.0",
  instructions:
    "Read WonderWhiz learning data for the signed-in parent. Use list_child_profiles first, then list_learning_topics for a child, then get_learning_topic for full section content.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listChildrenTool, listTopicsTool, getTopicTool],
});

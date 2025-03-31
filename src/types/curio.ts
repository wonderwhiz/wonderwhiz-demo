
export type ContentBlockType = "fact" | "quiz" | "flashcard" | "creative" | "task" | "riddle" | "funFact" | "activity" | "news" | "mindfulness";

export interface ContentBlock {
  id: string;
  curio_id: string;
  specialist_id: string;
  type: ContentBlockType;
  content: any;
  liked: boolean;
  bookmarked: boolean;
  created_at?: string;
}

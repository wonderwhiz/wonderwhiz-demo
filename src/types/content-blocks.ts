
import { ContentBlockType } from "./curio";

// Base interface for all content blocks
export interface ContentBlockBase {
  id: string;
  type: ContentBlockType;
  specialist_id: string;
  curio_id: string;
  liked?: boolean;
  bookmarked?: boolean;
  created_at?: string;
}

// Fact block interface
export interface FactBlock extends ContentBlockBase {
  type: "fact" | "funFact";
  content: {
    fact: string;
    title?: string;
    source?: string;
    rabbitHoles?: string[];
    imageUrl?: string;
  };
}

// Quiz block interface
export interface QuizBlock extends ContentBlockBase {
  type: "quiz";
  content: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
    difficulty?: "easy" | "medium" | "hard";
    topic?: string;
    completed?: boolean;
  };
}

// Flashcard block interface
export interface FlashcardBlock extends ContentBlockBase {
  type: "flashcard";
  content: {
    front: string;
    back: string;
    hint?: string;
    topic?: string;
    mastery?: number;
    lastReviewed?: string;
  };
}

// Creative block interface
export interface CreativeBlock extends ContentBlockBase {
  type: "creative";
  content: {
    prompt: string;
    description?: string;
    guidelines?: string;
    examples?: string[];
    submissionUrl?: string;
  };
}

// Task block interface
export interface TaskBlock extends ContentBlockBase {
  type: "task";
  content: {
    task: string;
    reward?: string;
    title?: string;
    description?: string;
    steps?: string[];
    completed?: boolean;
    dueDate?: string;
  };
}

// Riddle block interface
export interface RiddleBlock extends ContentBlockBase {
  type: "riddle";
  content: {
    riddle: string;
    answer: string;
    question?: string;
    hint?: string;
    solved?: boolean;
  };
}

// Activity block interface
export interface ActivityBlock extends ContentBlockBase {
  type: "activity";
  content: {
    activity: string;
    title?: string;
    instructions?: string;
    steps?: string[];
    materials?: string[];
    timeEstimate?: number;
    completed?: boolean;
  };
}

// Mindfulness block interface
export interface MindfulnessBlock extends ContentBlockBase {
  type: "mindfulness";
  content: {
    exercise: string;
    duration?: number;
    title?: string;
    instruction?: string;
    benefits?: string[];
    completed?: boolean;
  };
}

// News block interface
export interface NewsBlock extends ContentBlockBase {
  type: "news";
  content: {
    headline?: string;
    summary?: string;
    body?: string;
    source?: string;
    date?: string;
    imageUrl?: string;
    read?: boolean;
  };
}

// Union type of all content blocks
export type ContentBlock = 
  | FactBlock
  | QuizBlock
  | FlashcardBlock
  | CreativeBlock
  | TaskBlock
  | RiddleBlock
  | ActivityBlock
  | MindfulnessBlock
  | NewsBlock;

// Type guard to check if a block is a specific type
export function isBlockType<T extends ContentBlock>(
  block: ContentBlock,
  type: ContentBlockType
): block is T {
  return block.type === type;
}

// Content block validation function
export function validateBlock(block: any): ContentBlock | null {
  // Check for required base properties
  if (!block || !block.id || !block.type || !block.specialist_id) {
    console.error("Invalid block: missing required properties", block);
    return null;
  }

  // Validate content based on block type
  if (!block.content) {
    console.error("Invalid block: missing content", block);
    return null;
  }

  return block as ContentBlock;
}

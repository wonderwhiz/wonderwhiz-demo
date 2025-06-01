
export interface LearningTopic {
  id: string;
  child_id: string;
  title: string;
  description?: string;
  child_age: number;
  total_sections: number;
  current_section: number;
  status: 'planning' | 'in_progress' | 'completed';
  table_of_contents: TableOfContentsItem[];
  created_at: string;
  updated_at: string;
}

export interface TableOfContentsItem {
  section_number: number;
  title: string;
  description: string;
  estimated_reading_time: number;
  completed: boolean;
}

export interface LearningSection {
  id: string;
  topic_id: string;
  section_number: number;
  title: string;
  content: string;
  word_count: number;
  facts: string[];
  story_mode_content?: string;
  image_url?: string;
  image_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  topic_id: string;
  child_id: string;
  question_number: number;
  question: string;
  options: string[];
  correct_answer: number;
  user_answer?: number;
  is_correct: boolean;
  attempted_at: string;
}

export interface Certificate {
  id: string;
  child_id: string;
  topic_id: string;
  child_name: string;
  certificate_url?: string;
  points_earned: number;
  completed_at: string;
}

export interface PrintableActivity {
  id: string;
  topic_id: string;
  activity_type: 'coloring' | 'puzzle' | 'worksheet' | 'maze';
  title: string;
  description?: string;
  image_url?: string;
  difficulty_level: 1 | 2 | 3;
  created_at: string;
}

export interface LearningPoints {
  id: string;
  child_id: string;
  topic_id?: string;
  points: number;
  reason: string;
  earned_at: string;
}

export type Mood = 'explore' | 'build' | 'challenge' | 'calm';

export interface SectionStub {
  title: string;
  emoji: string;
}

export interface Predict {
  prompt: string;
  options: string[];
  correct_index: number;
  reveal: string;
}

export interface Spark {
  title: string;
  emoji: string;
  answer: string;
  wow_fact: string;
  image_prompt: string;
  sections: SectionStub[];
  predict?: Predict;
  rabbit_holes?: string[];
  heroUrl?: string;
}

export type CheckpointKind = 'quiz' | 'flip' | 'myth' | 'riddle';

export interface CheckpointData {
  kind: CheckpointKind;
  prompt: string;
  options: string[];
  correct_index: number;
  answer: string;
  explanation: string;
}

export interface SectionData {
  heading: string;
  emoji: string;
  body: string[];
  image_prompt: string;
  story: string;
  checkpoint: CheckpointData;
  imageUrl?: string;
}

export interface MakeBrief {
  kind: 'comic' | 'story' | 'poster' | 'quiz' | 'explainer' | 'project';
  title: string;
  emoji: string;
  brief: string;
  steps: string[];
  materials: string[];
}

export interface CurioRecord {
  id: string;
  question: string;
  title: string;
  emoji: string;
  mood: Mood;
  createdAt: number;
  completed: boolean;
}

export interface Trophy {
  id: string;
  title: string;
  emoji: string;
  topic: string;
  kind: string;
  createdAt: number;
  photo?: string;
}

export const MOODS: { id: Mood; label: string; emoji: string }[] = [
  { id: 'explore', label: 'Explore', emoji: '🧭' },
  { id: 'build', label: 'Build', emoji: '🛠️' },
  { id: 'challenge', label: 'Challenge', emoji: '⚔️' },
  { id: 'calm', label: 'Calm', emoji: '🌙' },
];

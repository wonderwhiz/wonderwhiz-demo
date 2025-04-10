
export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isActive: boolean;
}

export type ChapterIconType = 
  | 'introduction' 
  | 'exploration' 
  | 'understanding' 
  | 'challenge' 
  | 'creation' 
  | 'reflection' 
  | 'nextSteps';

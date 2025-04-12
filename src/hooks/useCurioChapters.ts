
import { useState } from 'react';
import { DEFAULT_CHAPTERS, Chapter } from '@/types/Chapter';

export const useCurioChapters = () => {
  const [chapters] = useState<Chapter[]>(DEFAULT_CHAPTERS);
  
  return chapters;
};

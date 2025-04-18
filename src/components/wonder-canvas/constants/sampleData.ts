
// Sample wonder cards for the canvas
export const sampleCards = [
  {
    id: '1',
    title: 'Exploring the Ocean Depths',
    content: 'The ocean is full of amazing creatures! Did you know that the deepest part of the ocean is called the Mariana Trench? It's deeper than Mount Everest is tall!',
    backgroundColor: 'from-blue-600/30 to-indigo-800/30',
    relevanceScore: 95,
    relatedTopics: ['Marine Biology', 'Oceanography', 'Deep Sea Creatures'],
    emotionalTone: 'exciting',
  },
  {
    id: '2',
    title: 'The Solar System',
    content: 'Our Solar System has 8 planets that orbit around the Sun. Earth is the only planet known to have life, but scientists are exploring Mars to see if it once had living things!',
    backgroundColor: 'from-indigo-800/30 to-purple-800/30',
    relevanceScore: 90,
    relatedTopics: ['Astronomy', 'Planets', 'Space Exploration'],
    emotionalTone: 'curious',
  },
  {
    id: '3',
    title: 'Dinosaur Discovery',
    content: 'Dinosaurs lived on Earth millions of years ago. The largest dinosaur was called Argentinosaurus, and it was as long as 3 school buses!',
    backgroundColor: 'from-amber-700/30 to-red-800/30',
    relevanceScore: 88,
    relatedTopics: ['Paleontology', 'Natural History', 'Fossils'],
    emotionalTone: 'fascinating',
  }
];

// Sample constellation nodes and edges for knowledge visualization
export const constellationNodes = [
  { id: 'n1', title: 'Space', x: 50, y: 25, size: 42, color: '#a78bfa', locked: false },
  { id: 'n2', title: 'Oceans', x: 25, y: 60, size: 36, color: '#60a5fa', locked: false },
  { id: 'n3', title: 'Dinosaurs', x: 75, y: 60, size: 38, color: '#f97316', locked: false },
  { id: 'n4', title: 'Robots', x: 35, y: 40, size: 32, color: '#94a3b8', locked: false },
  { id: 'n5', title: 'Animals', x: 65, y: 40, size: 34, color: '#4ade80', locked: false },
  { id: 'n6', title: 'Chemistry', x: 20, y: 30, size: 30, color: '#facc15', locked: true },
];

export const constellationEdges = [
  { source: 'n1', target: 'n4', strength: 0.5 },
  { source: 'n1', target: 'n5', strength: 0.3 },
  { source: 'n2', target: 'n5', strength: 0.8 },
  { source: 'n3', target: 'n5', strength: 0.7 },
  { source: 'n4', target: 'n5', strength: 0.4 },
  { source: 'n1', target: 'n6', strength: 0.2 },
];

// Sample tasks for task orbits
export const sampleTasks = [
  {
    id: 't1',
    title: 'Read about Dinosaurs',
    type: 'learning',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000) // tomorrow
  },
  {
    id: 't2',
    title: 'Draw a Space Scene',
    type: 'creative',
    completed: false,
    priority: 'medium'
  },
  {
    id: 't3',
    title: 'Practice Math Quiz',
    type: 'daily',
    completed: true,
    priority: 'medium'
  },
  {
    id: 't4',
    title: 'Complete Ocean Challenge',
    type: 'challenge',
    completed: false,
    priority: 'low'
  },
  {
    id: 't5',
    title: 'Learn a New Word',
    type: 'daily',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 43200000) // 12 hours from now
  }
];

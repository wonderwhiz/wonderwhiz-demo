
export interface SpecialistInfo {
  name: string;
  title?: string;
  avatar: string;
  fallbackColor: string;
  fallbackInitial: string;
}

export const getSpecialistInfo = (specialistId: string): SpecialistInfo => {
  const specialists: Record<string, SpecialistInfo> = {
    nova: {
      name: 'Nova',
      title: 'Space Expert',
      avatar: '/specialists/nova-avatar.png',
      fallbackColor: 'bg-blue-600',
      fallbackInitial: 'N',
    },
    spark: {
      name: 'Spark',
      title: 'Creative Genius',
      avatar: '/specialists/spark-avatar.png',
      fallbackColor: 'bg-yellow-500',
      fallbackInitial: 'S',
    },
    prism: {
      name: 'Prism',
      title: 'Science Wizard',
      avatar: '/specialists/prism-avatar.png',
      fallbackColor: 'bg-green-600',
      fallbackInitial: 'P',
    },
    pixel: {
      name: 'Pixel',
      title: 'Tech Guru',
      avatar: '/specialists/pixel-avatar.png',
      fallbackColor: 'bg-indigo-600',
      fallbackInitial: 'P',
    },
    atlas: {
      name: 'Atlas',
      title: 'History Expert',
      avatar: '/specialists/atlas-avatar.png',
      fallbackColor: 'bg-amber-700',
      fallbackInitial: 'A',
    },
    lotus: {
      name: 'Lotus',
      title: 'Nature Guide',
      avatar: '/specialists/lotus-avatar.png',
      fallbackColor: 'bg-emerald-600',
      fallbackInitial: 'L',
    },
    default: {
      name: 'Specialist',
      title: 'Knowledge Guide',
      avatar: '',
      fallbackColor: 'bg-purple-600',
      fallbackInitial: 'S',
    }
  };
  
  return specialists[specialistId] || specialists.default;
};

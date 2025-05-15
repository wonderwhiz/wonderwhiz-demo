
import React from 'react';
import { ContentBlockType } from '@/types/curio';

export interface BlockDecoratorProps {
  type: ContentBlockType;
  children: React.ReactNode;
}

const BlockDecorator: React.FC<BlockDecoratorProps> = ({ type, children }) => {
  const getDecorationStyles = () => {
    switch(type) {
      case 'fact':
        return {
          bgClass: 'bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5',
          decorationClass: 'after:bg-blue-600/20 before:bg-blue-600/20',
        };
      case 'funFact':
        return {
          bgClass: 'bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5',
          decorationClass: 'after:bg-amber-600/20 before:bg-amber-600/20',
        };
      case 'quiz':
        return {
          bgClass: 'bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5',
          decorationClass: 'after:bg-purple-600/20 before:bg-purple-600/20',
        };
      case 'flashcard':
        return {
          bgClass: 'bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5',
          decorationClass: 'after:bg-green-600/20 before:bg-green-600/20',
        };
      case 'creative':
        return {
          bgClass: 'bg-gradient-to-br from-pink-500/10 via-transparent to-pink-500/5',
          decorationClass: 'after:bg-pink-600/20 before:bg-pink-600/20',
        };
      case 'task':
        return {
          bgClass: 'bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5',
          decorationClass: 'after:bg-amber-600/20 before:bg-amber-600/20',
        };
      case 'riddle':
        return {
          bgClass: 'bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-500/5',
          decorationClass: 'after:bg-cyan-600/20 before:bg-cyan-600/20',
        };
      case 'activity':
        return {
          bgClass: 'bg-gradient-to-br from-teal-500/10 via-transparent to-teal-500/5',
          decorationClass: 'after:bg-teal-600/20 before:bg-teal-600/20',
        };
      case 'news':
        return {
          bgClass: 'bg-gradient-to-br from-red-500/10 via-transparent to-red-500/5',
          decorationClass: 'after:bg-red-600/20 before:bg-red-600/20',
        };
      case 'mindfulness':
        return {
          bgClass: 'bg-gradient-to-br from-indigo-500/10 via-transparent to-indigo-500/5',
          decorationClass: 'after:bg-indigo-600/20 before:bg-indigo-600/20',
        };
      default:
        return {
          bgClass: 'bg-gradient-to-br from-gray-500/10 via-transparent to-gray-500/5',
          decorationClass: 'after:bg-gray-600/20 before:bg-gray-600/20',
        };
    }
  };
  
  const { bgClass, decorationClass } = getDecorationStyles();
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${bgClass} z-0 
      after:absolute after:top-0 after:left-0 after:w-20 after:h-20 after:rounded-full after:blur-3xl after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-30
      before:absolute before:bottom-0 before:right-0 before:w-32 before:h-32 before:rounded-full before:blur-3xl before:translate-x-1/4 before:translate-y-1/4 before:opacity-30
      ${decorationClass}`}>
      {children}
    </div>
  );
};

export default BlockDecorator;

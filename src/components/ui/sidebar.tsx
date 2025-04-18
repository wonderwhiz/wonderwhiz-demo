
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  openSidebar: () => {},
  closeSidebar: () => {},
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export interface SidebarProps {
  children: ReactNode;
  side?: 'left' | 'right';
  width?: string;
  className?: string;
  variant?: 'default' | 'transparent' | 'blurred';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  children, 
  side = 'left',
  width = '280px',
  className = '',
  variant = 'default'
}) => {
  const { isOpen, closeSidebar } = useSidebar();
  
  // Determine background style based on variant
  const getBgStyle = () => {
    switch (variant) {
      case 'transparent':
        return 'bg-transparent border-white/10';
      case 'blurred':
        return 'bg-white/5 backdrop-blur-md border-white/10';
      default:
        return 'bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-light-purple/90 backdrop-blur-md border-r border-white/10';
    }
  };

  const variants = {
    open: { 
      x: side === 'left' ? 0 : 'calc(100vw - ' + width + ')', 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      x: side === 'left' ? '-100%' : '100%', 
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeSidebar}
          />
          
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            className={`fixed top-0 bottom-0 z-50 ${getBgStyle()} overflow-y-auto ${className}`}
            style={{ 
              width,
              [side]: 0,
            }}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              onClick={closeSidebar}
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Add the missing components that are causing the error
export const SidebarHeader: React.FC<{ children: ReactNode, className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 pb-3 border-b border-white/10 ${className}`}>
      {children}
    </div>
  );
};

export const SidebarContent: React.FC<{ children: ReactNode, className?: string }> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`mt-3 ${className}`}>
      {children}
    </div>
  );
};

export const SidebarTrigger: React.FC<{ 
  children: ReactNode,
  className?: string 
}> = ({ 
  children,
  className = ''
}) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <button
      onClick={toggleSidebar}
      className={`flex items-center justify-center rounded-md hover:bg-white/10 ${className}`}
    >
      {children}
    </button>
  );
};

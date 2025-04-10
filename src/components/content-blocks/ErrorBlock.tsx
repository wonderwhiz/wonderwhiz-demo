
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBlockProps {
  message: string;
  onRetry?: () => void;
  updateHeight?: (height: number) => void;
}

const ErrorBlock: React.FC<ErrorBlockProps> = ({ 
  message, 
  onRetry,
  updateHeight
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (blockRef.current && updateHeight) {
      updateHeight(blockRef.current.offsetHeight);
    }
  }, [message, updateHeight]);
  
  return (
    <Card 
      ref={blockRef}
      className="overflow-hidden bg-red-500/10 border-red-500/30 shadow-md"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-medium text-white">Error Loading Content</h3>
        </div>
        
        <p className="text-white/80 mb-4">{message}</p>
        
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorBlock;

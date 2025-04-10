
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBlockProps {
  message: string;
  updateHeight?: (height: number) => void;
  onRetry?: () => void;
}

const ErrorBlock: React.FC<ErrorBlockProps> = ({ 
  message,
  updateHeight,
  onRetry
}) => {
  const blockRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (blockRef.current && updateHeight) {
      updateHeight(blockRef.current.offsetHeight);
    }
  }, [message, updateHeight]);

  return (
    <Card 
      ref={blockRef} 
      className="overflow-hidden bg-red-950/20 backdrop-blur-sm border-red-500/30 p-4"
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        
        <div>
          <h3 className="text-red-300 font-medium text-sm mb-2">Something went wrong</h3>
          <p className="text-white/80 text-sm mb-4">{message}</p>
          
          {onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRetry}
              className="border-red-500/30 text-red-300 hover:text-red-200 hover:bg-red-950/30"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ErrorBlock;

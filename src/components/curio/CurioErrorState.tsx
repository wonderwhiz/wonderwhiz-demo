
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface CurioErrorStateProps {
  message?: string;
}

const CurioErrorState: React.FC<CurioErrorStateProps> = ({ message = "Something went wrong" }) => {
  return (
    <Alert variant="destructive" className="my-4 bg-red-500/10 border-red-500/30">
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Error</AlertTitle>
      <AlertDescription className="text-red-200">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default CurioErrorState;

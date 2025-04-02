
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface CurioRedirectProps {
  curioId: string;
  label?: string;
}

const CurioRedirect: React.FC<CurioRedirectProps> = ({ 
  curioId, 
  label = "Open Curio" 
}) => {
  const navigate = useNavigate();
  
  const handleRedirect = () => {
    navigate(`/curio/${curioId}`);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-wonderwhiz-purple border-wonderwhiz-purple/30 hover:bg-wonderwhiz-purple/10"
      onClick={handleRedirect}
    >
      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
      {label}
    </Button>
  );
};

export default CurioRedirect;

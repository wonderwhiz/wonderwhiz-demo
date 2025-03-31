
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CurioTestButtonProps {
  profileId: string;
}

const CurioTestButton: React.FC<CurioTestButtonProps> = ({ profileId }) => {
  const navigate = useNavigate();
  
  // Use a test curio ID for navigation
  const handleNavigation = () => {
    // Creating a random ID for testing purposes
    const testCurioId = "test-" + Math.random().toString(36).substring(2, 15);
    console.log(`Navigating to curio page with profileId: ${profileId}, curioId: ${testCurioId}`);
    navigate(`/curio/${profileId}/${testCurioId}`);
  };

  return (
    <Button
      onClick={handleNavigation}
      variant="outline"
      className="bg-white/10 text-white hover:bg-white/20 mt-2"
    >
      Test Curio Page
    </Button>
  );
};

export default CurioTestButton;

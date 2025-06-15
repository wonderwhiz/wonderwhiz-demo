
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import WonderWhizLogo from '@/components/WonderWhizLogo';
import MagicalBorder from '@/components/MagicalBorder';
import FloatingElements from '@/components/FloatingElements';
import { ChildProfile } from '@/types/profiles';

interface PinDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedProfile: ChildProfile | null;
  onSubmit: () => void;
  pinError: boolean;
  onPinChange: (pin: string) => void;
  pinInput: string;
}

const PinDialog: React.FC<PinDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedProfile,
  onSubmit,
  pinError,
  onPinChange,
  pinInput,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="bg-wonderwhiz-dark border border-white/20 max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <motion.div
                  animate={{ 
                    y: [0, -6, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  <WonderWhizLogo className="h-20 w-20" />
                </motion.div>
              </div>
              
              <DialogTitle className="text-white text-center text-2xl font-baloo mt-6">
                Enter Your Secret PIN
              </DialogTitle>
              
              <DialogDescription className="text-white/70 text-center">
                {selectedProfile?.name}'s magical portal awaits!
              </DialogDescription>
              
              <div className="my-8 relative">
                <MagicalBorder 
                  active={!pinError}
                  type={pinError ? 'purple' : 'rainbow'}
                  className="rounded-lg"
                >
                  <Input
                    type="password"
                    maxLength={6}
                    className={`text-center text-2xl bg-white/10 border-white/20 text-white h-14 ${
                      pinError ? 'border-red-500 animate-shake' : ''
                    }`}
                    value={pinInput}
                    onChange={(e) => onPinChange(e.target.value)}
                    placeholder="• • • •"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSubmit();
                      }
                    }}
                    autoFocus
                  />
                </MagicalBorder>
                
                {pinError && (
                  <motion.p 
                    className="text-red-400 text-sm mt-2 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Oops! That's not the correct PIN. Try again!
                  </motion.p>
                )}
                
                <FloatingElements type="sparkles" density="low" />
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={onSubmit}
                  className="bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-purple hover:brightness-110 text-white font-medium px-6"
                >
                  Let's Go!
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default PinDialog;

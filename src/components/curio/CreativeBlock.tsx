
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Send, Image, Sparkles, X, Camera, VolumeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface CreativeBlockProps {
  prompt: string;
  examples?: string[];
  specialistId: string;
  onComplete?: () => void;
  onUpload?: (file: File) => void;
  childAge?: number;
  onReadAloud?: (text: string) => void;
}

const CreativeBlock: React.FC<CreativeBlockProps> = ({
  prompt,
  examples = [], // Set default empty array
  specialistId,
  onComplete,
  onUpload,
  childAge = 10,
  onReadAloud
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [response, setResponse] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const getSpecialistInfo = () => {
    const specialists = {
      nova: {
        name: 'Nova',
        avatar: '/specialists/nova-avatar.png',
        fallbackColor: 'bg-blue-600',
        fallbackInitial: 'N',
      },
      spark: {
        name: 'Spark',
        avatar: '/specialists/spark-avatar.png',
        fallbackColor: 'bg-yellow-500',
        fallbackInitial: 'S',
      },
      prism: {
        name: 'Prism',
        avatar: '/specialists/prism-avatar.png',
        fallbackColor: 'bg-green-600',
        fallbackInitial: 'P',
      },
      whizzy: {
        name: 'Whizzy',
        avatar: '/specialists/whizzy-avatar.png',
        fallbackColor: 'bg-purple-600',
        fallbackInitial: 'W',
      },
    };
    
    return specialists[specialistId as keyof typeof specialists] || specialists.spark;
  };
  
  const specialist = getSpecialistInfo();
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    
    if (option === "Upload a drawing" || option === "Take a photo") {
      // Don't show text input for these options
    } else {
      toast.info(`Great choice! Let's ${option.toLowerCase()}`);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    toast.success(
      childAge < 8 ? "Yay! Your creation is ready to submit!" : "Image ready to submit!",
      { duration: 3000 }
    );
  };
  
  const handleSubmit = () => {
    if (selectedOption === "Upload a drawing" || selectedOption === "Take a photo") {
      if (!uploadedFile) {
        toast.error("Please select an image first");
        return;
      }
      
      if (onUpload) {
        onUpload(uploadedFile);
      }
    } else if (!response.trim()) {
      toast.error("Please share your creative response");
      return;
    }
    
    setHasSubmitted(true);
    
    toast.success(
      childAge < 8 ? "Amazing job! Your creation has been submitted! 🎉" : "Your creative response has been submitted! 🎉",
      { duration: 3000 }
    );
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const resetUpload = () => {
    setImagePreview(null);
    setUploadedFile(null);
  };
  
  const handleReadAloud = () => {
    if (onReadAloud) {
      onReadAloud(prompt + ". " + (examples.length > 0 ? "Examples: " + examples.join(", ") : ""));
    }
  };

  // Default examples if none provided
  const displayExamples = examples.length > 0 ? examples : ["Write a story", "Draw a picture"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg border border-white/10 bg-gradient-to-br from-yellow-600/20 to-amber-900/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-vibrant-yellow/5 to-amber-500/5 pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex items-start gap-4 mb-5">
            <Avatar className="h-12 w-12 rounded-2xl border-2 border-white/10 ring-2 ring-wonderwhiz-vibrant-yellow/30 shadow-glow-brand-yellow">
              <AvatarImage src={specialist.avatar} />
              <AvatarFallback className={specialist.fallbackColor}>
                {specialist.fallbackInitial}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-nunito">Creative Challenge</h3>
                <div className="hidden md:flex items-center">
                  <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow animate-pulse" />
                </div>
              </div>
              
              <div className="mt-1 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAloud}
                  className="text-white/70 hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10 p-1 h-auto"
                >
                  <VolumeIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">Read aloud</span>
                </Button>
                <p className="text-sm text-white/70 font-inter">From {specialist.name}</p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white font-inter mb-6 leading-relaxed font-medium">
              {prompt}
            </p>
            
            {!selectedOption ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayExamples.map((example, idx) => (
                  <motion.button
                    key={idx}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl p-4 text-left text-white transition-all duration-300"
                    onClick={() => handleOptionSelect(example)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {idx === 0 && <Pencil className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />}
                      {idx === 1 && <Image className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />}
                      {idx === 2 && <Camera className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />}
                      <span>{example}</span>
                    </div>
                  </motion.button>
                ))}
                
                <motion.button
                  className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl p-4 text-left text-white transition-all duration-300"
                  onClick={() => handleOptionSelect("Upload a drawing")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Image className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                    <span>Upload a drawing</span>
                  </div>
                </motion.button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {selectedOption === "Upload a drawing" || selectedOption === "Take a photo" ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    {!imagePreview ? (
                      <div className="text-center py-8">
                        <label className="cursor-pointer">
                          <div className="bg-white/10 rounded-xl p-8 border-2 border-dashed border-white/20 hover:border-white/30 transition-all duration-300 mb-4">
                            <div className="flex flex-col items-center">
                              <Image className="h-8 w-8 text-white/70 mb-3" />
                              <p className="text-white font-medium mb-1">
                                {childAge < 8 ? "Tap to add your picture" : "Click to upload an image"}
                              </p>
                              <p className="text-white/70 text-sm">
                                {childAge < 8 ? "Share your awesome creation!" : "Share your creative work"}
                              </p>
                            </div>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Your creation" 
                          className="w-full rounded-lg object-contain max-h-64 mx-auto"
                        />
                        <button
                          onClick={resetUpload}
                          className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <p className="text-white/80 mb-3">
                      {childAge < 8 
                        ? `Share your ${selectedOption?.toLowerCase() || "creative work"} here!` 
                        : `Share your response (${selectedOption})`}
                    </p>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder={childAge < 8 
                        ? "Type your amazing ideas..." 
                        : "Enter your creative response..."}
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-vibrant-yellow/50 font-inter resize-none"
                      rows={4}
                      disabled={hasSubmitted}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {selectedOption && !hasSubmitted && (
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOption(null);
                  setResponse('');
                  setImagePreview(null);
                  setUploadedFile(null);
                }}
                className="text-white/70 hover:text-white"
              >
                Back
              </Button>
              
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={
                  (selectedOption === "Upload a drawing" || selectedOption === "Take a photo")
                    ? !uploadedFile
                    : !response.trim()
                }
                className="bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-black font-medium"
              >
                <Send className="h-4 w-4 mr-1.5" />
                Submit
              </Button>
            </div>
          )}

          {hasSubmitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="pt-4 border-t border-white/10 mt-4"
            >
              <p className="text-white/90 font-inter">
                {childAge < 8 
                  ? "Wow! Thank you for sharing your amazing creativity!" 
                  : "Thank you for submitting your creative response!"}
              </p>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedOption(null);
                  setResponse('');
                  setHasSubmitted(false);
                  setImagePreview(null);
                  setUploadedFile(null);
                }}
                className="mt-3 border-wonderwhiz-vibrant-yellow/30 text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10"
              >
                Try another approach
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreativeBlock;

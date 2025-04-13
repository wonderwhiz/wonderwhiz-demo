
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, Bookmark, ExternalLink, VolumeIcon } from 'lucide-react';

interface AgeAdaptiveContentProps {
  content: string;
  childAge: number;
  onReadAloud?: () => void;
  onBookmark?: () => void;
  onLearnMore?: () => void;
  imageUrl?: string;
}

const AgeAdaptiveContent: React.FC<AgeAdaptiveContentProps> = ({
  content,
  childAge,
  onReadAloud,
  onBookmark,
  onLearnMore,
  imageUrl
}) => {
  // Adapt content presentation based on age
  const getContentStyle = () => {
    if (childAge < 8) {
      return "text-xl leading-relaxed font-medium";
    } else if (childAge < 12) {
      return "text-lg leading-relaxed";
    } else {
      return "text-base leading-normal";
    }
  };
  
  // Determine if we should show read aloud option prominently
  const showReadAloudProminent = childAge < 9;

  return (
    <div className="bg-white/5 rounded-lg p-5 border border-white/10">
      {/* Content with age-appropriate styling */}
      <div className={`text-white ${getContentStyle()} mb-4`}>
        {content}
      </div>
      
      {/* Optional image - shown more prominently for younger children */}
      {imageUrl && (
        <div className={`${childAge < 10 ? 'mb-6' : 'mb-4'} rounded-lg overflow-hidden`}>
          <img 
            src={imageUrl} 
            alt="Illustration" 
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {/* Action buttons - adapted for age */}
      <div className="flex flex-wrap gap-2 mt-3">
        {onReadAloud && (
          <Button
            variant={showReadAloudProminent ? "default" : "outline"}
            size="sm"
            onClick={onReadAloud}
            className={showReadAloudProminent ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80" : "text-white/70"}
          >
            <VolumeIcon className="h-4 w-4 mr-2" />
            {childAge < 8 ? "Read to me" : "Read aloud"}
          </Button>
        )}
        
        {onBookmark && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBookmark}
            className="text-white/70"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            {childAge < 10 ? "Save" : "Bookmark"}
          </Button>
        )}
        
        {/* Show "Learn More" only for older children */}
        {onLearnMore && childAge >= 10 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLearnMore}
            className="text-white/70"
          >
            <Book className="h-4 w-4 mr-2" />
            Learn more
          </Button>
        )}
      </div>
      
      {/* For younger children, add encouraging emojis */}
      {childAge < 8 && (
        <div className="mt-4 text-lg">
          {["🌟", "🎯", "🧠", "🔍", "💫"].map((emoji, i) => (
            <span key={i} className="mr-2">{emoji}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgeAdaptiveContent;

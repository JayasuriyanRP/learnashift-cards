
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code } from 'lucide-react';

interface CardProps {
  id: string;
  question: string;
  answer: string;
  onFlip: (id: string, isFlipped: boolean) => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  id,
  question,
  answer,
  onFlip,
  className
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);
    onFlip(id, newFlipState);
  };

  // Helper function to check if content contains code blocks
  const hasCodeBlock = (content: string) => {
    return content.includes('```') || content.includes('`');
  };

  // Helper function to format content with code blocks
  const formatContent = (content: string) => {
    if (!content.includes('```')) {
      return content;
    }

    // Replace markdown code blocks with styled pre elements
    return content.split('```').map((part, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      } else {
        return (
          <pre key={index} className="bg-muted p-3 rounded-md text-left overflow-x-auto text-sm font-mono my-2">
            <code>{part}</code>
          </pre>
        );
      }
    });
  };

  // Determine if content has code
  const questionHasCode = hasCodeBlock(question);
  const answerHasCode = hasCodeBlock(answer);

  return (
    <div
      className={cn(
        'flip-card w-full max-w-md h-64 cursor-pointer mx-auto',
        isFlipped ? 'flipped' : '',
        className
      )}
      onClick={handleFlip}
    >
      <div className="flip-card-inner shadow-lg h-full">
        <div className="flip-card-front bg-card p-6 flex items-center justify-center rounded-lg border border-border/30">
          <div className="text-center w-full">
            <div className="text-xs uppercase tracking-wider text-primary/80 font-medium mb-3 flex items-center justify-center gap-1">
              Question
              {questionHasCode && <Code className="h-3 w-3" />}
            </div>
            
            <ScrollArea className="h-[180px] w-full">
              <div className={cn(
                "text-xl font-medium leading-relaxed", 
                questionHasCode ? "text-left whitespace-pre-wrap break-words" : ""
              )}>
                {formatContent(question)}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="flip-card-back bg-primary/5 p-6 flex items-center justify-center rounded-lg border border-primary/20">
          <div className="text-center w-full">
            <div className="text-xs uppercase tracking-wider text-primary/80 font-medium mb-3 flex items-center justify-center gap-1">
              Answer
              {answerHasCode && <Code className="h-3 w-3" />}
            </div>
            
            <ScrollArea className="h-[180px] w-full">
              <div className={cn(
                "text-lg leading-relaxed", 
                answerHasCode ? "text-left whitespace-pre-wrap break-words" : ""
              )}>
                {formatContent(answer)}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

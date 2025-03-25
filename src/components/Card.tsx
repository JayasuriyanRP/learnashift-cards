
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

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
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-primary/80 font-medium mb-3">Question</div>
            <h3 className="text-xl font-medium leading-relaxed">{question}</h3>
          </div>
        </div>
        <div className="flip-card-back bg-primary/5 p-6 flex items-center justify-center rounded-lg border border-primary/20">
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-primary/80 font-medium mb-3">Answer</div>
            <p className="text-lg leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

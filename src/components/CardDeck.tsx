
import React, { useState, useEffect } from 'react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface CardDeckProps {
  cards: Flashcard[];
}

const CardDeck: React.FC<CardDeckProps> = ({ cards }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

  const totalCards = cards.length;
  const currentCard = cards[currentCardIndex];
  
  const reviewedCount = Object.keys(flippedCards).length;
  const progress = totalCards > 0 ? (reviewedCount / totalCards) * 100 : 0;

  const handleCardFlip = (id: string, isFlipped: boolean) => {
    setFlippedCards(prev => ({ ...prev, [id]: isFlipped }));
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0 && !isAnimating) {
      setDirection('prev');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCardIndex(current => current - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < totalCards - 1 && !isAnimating) {
      setDirection('next');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCardIndex(current => current + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevCard();
    } else if (e.key === 'ArrowRight') {
      handleNextCard();
    } else if (e.key === ' ' || e.key === 'Enter') {
      const id = currentCard.id;
      const isCurrentlyFlipped = flippedCards[id] || false;
      handleCardFlip(id, !isCurrentlyFlipped);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentCardIndex, flippedCards, isAnimating]);

  const getCardAnimationClass = () => {
    if (isAnimating) {
      return direction === 'next' 
        ? 'animate-fade-out opacity-0' 
        : 'animate-fade-out opacity-0';
    }
    return 'animate-fade-in';
  };

  if (!currentCard) {
    return <div className="text-center py-12">No flashcards available</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <ProgressBar progress={progress} />
        <div className="text-sm text-muted-foreground text-center mt-2">
          {reviewedCount} of {totalCards} cards reviewed
        </div>
      </div>
      
      <div className="relative px-4 py-8">
        <div className={`transition-all duration-300 ${getCardAnimationClass()}`}>
          <Card
            key={currentCard.id}
            id={currentCard.id}
            question={currentCard.question}
            answer={currentCard.answer}
            onFlip={handleCardFlip}
          />
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous card"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center text-sm text-muted-foreground font-medium">
            {currentCardIndex + 1} / {totalCards}
          </div>
          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === totalCards - 1}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next card"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDeck;

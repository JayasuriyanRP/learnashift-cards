
import React, { useState, useEffect } from 'react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
  const [assessments, setAssessments] = useState<Record<string, 'correct' | 'incorrect' | null>>({});
  const [showAssessment, setShowAssessment] = useState(false);

  const totalCards = cards.length;
  const currentCard = cards[currentCardIndex];
  
  const reviewedCount = Object.keys(flippedCards).length;
  const progress = totalCards > 0 ? (reviewedCount / totalCards) * 100 : 0;
  
  const correctCount = Object.values(assessments).filter(val => val === 'correct').length;
  const incorrectCount = Object.values(assessments).filter(val => val === 'incorrect').length;
  const assessedCount = correctCount + incorrectCount;
  const score = assessedCount > 0 ? Math.round((correctCount / assessedCount) * 100) : 0;

  // Check if all cards have been assessed
  useEffect(() => {
    if (assessedCount === totalCards && totalCards > 0) {
      setShowAssessment(true);
      toast({
        title: "Assessment Complete!",
        description: `Your score: ${score}%. Review your results below.`,
        duration: 5000,
      });
    }
  }, [assessedCount, totalCards, score]);

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

  const handleAssessment = (isCorrect: boolean) => {
    if (!currentCard) return;
    
    const assessment = isCorrect ? 'correct' : 'incorrect';
    setAssessments(prev => ({ ...prev, [currentCard.id]: assessment }));
    
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "Good job!" : "Keep practicing!",
      duration: 1500,
    });
    
    // Move to next card after assessment if not on the last card
    if (currentCardIndex < totalCards - 1) {
      handleNextCard();
    }
  };

  const resetAssessment = () => {
    setAssessments({});
    setFlippedCards({});
    setCurrentCardIndex(0);
    setShowAssessment(false);
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
    } else if (e.key === '1' || e.key === 'y') {
      handleAssessment(true);
    } else if (e.key === '0' || e.key === 'n') {
      handleAssessment(false);
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
  
  if (showAssessment) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-card border border-border/30 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Assessment Results</h2>
        
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 text-primary px-6 py-4 rounded-full text-center">
            <span className="text-4xl font-bold">{score}%</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-lg font-medium text-green-600">{correctCount}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-red-600">{incorrectCount}</div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium">{totalCards}</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </div>
        </div>
        
        <div className="space-y-3 mt-6 max-h-[300px] overflow-y-auto">
          {cards.map((card) => {
            const assessment = assessments[card.id];
            return (
              <div 
                key={card.id} 
                className={`p-3 rounded-md border flex items-center justify-between ${
                  assessment === 'correct' 
                    ? 'bg-green-50 border-green-200' 
                    : assessment === 'incorrect' 
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{card.question}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {assessment === 'correct' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {assessment === 'incorrect' && (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  {assessment === null && (
                    <span className="text-xs text-gray-500">Not answered</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={resetAssessment}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Start Again
          </button>
        </div>
      </div>
    );
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

        <div className="flex justify-between items-center mt-8">
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
        
        {flippedCards[currentCard.id] && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handleAssessment(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              aria-label="Mark as incorrect"
            >
              <X size={16} />
              <span>Incorrect</span>
            </button>
            <button
              onClick={() => handleAssessment(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              aria-label="Mark as correct"
            >
              <Check size={16} />
              <span>Correct</span>
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Tip: Use keyboard arrows ← → to navigate, Space to flip, Y/1 for correct, N/0 for incorrect
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardDeck;

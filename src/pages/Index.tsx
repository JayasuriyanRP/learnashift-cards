
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CardDeck from '@/components/CardDeck';
import flashcardsData from '@/data/flashcards.json';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Flashcards loaded",
        description: `${flashcardsData.cards.length} cards are ready for review`,
        duration: 3000,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <Header 
          title={flashcardsData.title} 
          subtitle={flashcardsData.description}
        />
        
        <main className="py-8">
          <CardDeck cards={flashcardsData.cards} />

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Tip: Use keyboard arrows ← → to navigate or Space to flip
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import CardDeck from '@/components/CardDeck';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

// We'll dynamically import the flashcard data based on the path ID
const PathDetails = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const [flashcards, setFlashcards] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        // Dynamically import the flashcard data based on the path ID
        const module = await import(`../data/${pathId}-flashcards.json`);
        setFlashcards(module.default);
        
        toast({
          title: "Flashcards loaded",
          description: `${module.default.cards.length} cards are ready for review`,
          duration: 3000,
        });
      } catch (err) {
        console.error('Failed to load flashcards:', err);
        setError('Could not load the flashcards for this learning path.');
      } finally {
        setIsLoading(false);
      }
    };

    if (pathId) {
      const timer = setTimeout(() => {
        loadFlashcards();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [pathId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  if (error || !flashcards) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-destructive mb-4">{error || 'Path not found'}</p>
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Link>
        </div>
        
        <Header 
          title={flashcards.title} 
          subtitle={flashcards.description}
        />
        
        <main className="py-8">
          <CardDeck cards={flashcards.cards} />

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

export default PathDetails;

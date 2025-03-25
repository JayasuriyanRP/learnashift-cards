
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import CardDeck from '@/components/CardDeck';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, BookOpen, Brain, Code } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// We'll dynamically import the flashcard data based on the path ID
const PathDetails = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const [flashcards, setFlashcards] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCodeTipsOpen, setIsCodeTipsOpen] = useState(false);

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
        
        <div className="mt-6 mb-4">
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full p-4 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">How to Use Self-Assessment</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {isOpen ? 'Click to collapse' : 'Click to expand'}
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-2 text-sm">
              <div className="space-y-2 bg-card p-4 rounded-lg border border-border/30">
                <p className="font-medium">Self-assess your knowledge with these steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Flip the card to see the answer.</li>
                  <li>Honestly evaluate if you knew the answer.</li>
                  <li>Mark it as "Correct" or "Incorrect".</li>
                  <li>Review your assessment results at the end.</li>
                </ol>
                <p className="text-muted-foreground mt-2">Keyboard shortcuts: Space to flip card, Y/1 for correct, N/0 for incorrect.</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <div className="mb-8">
          <Collapsible
            open={isCodeTipsOpen}
            onOpenChange={setIsCodeTipsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full p-4 bg-secondary/5 hover:bg-secondary/10 rounded-lg border border-secondary/20 transition-colors">
                <div className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-secondary-foreground" />
                  <h3 className="text-lg font-medium">Code Blocks in Flashcards</h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  {isCodeTipsOpen ? 'Click to collapse' : 'Click to expand'}
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-2 text-sm">
              <div className="space-y-2 bg-card p-4 rounded-lg border border-border/30">
                <p className="font-medium">How to use code blocks in flashcards:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Wrap code snippets with triple backticks (```code here```) for syntax highlighting.</li>
                  <li>For inline code, use single backticks (`code`).</li>
                  <li>Longer code snippets will automatically get a scrollbar.</li>
                  <li>Cards with code will display a code icon indicator.</li>
                </ul>
                <pre className="bg-muted p-2 rounded-md text-left overflow-x-auto text-xs font-mono mt-2">
                  <code>{`Example: \`\`\`\nfunction hello() {\n  console.log("Hello world!");\n}\n\`\`\``}</code>
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <main className="py-4">
          <CardDeck cards={flashcards.cards} />
        </main>
      </div>
    </div>
  );
};

export default PathDetails;

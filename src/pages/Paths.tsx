
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PathCard from '@/components/PathCard';
import learningPaths from '@/data/learningPaths.json';

const Paths = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading learning paths...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <Header 
          title="Learning Paths" 
          subtitle="Choose a topic to start learning with flashcards"
        />
        
        <main className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <PathCard
                key={path.id}
                id={path.id}
                title={path.title}
                description={path.description}
                icon={path.icon}
                color={path.color}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Paths;

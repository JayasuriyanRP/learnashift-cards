
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, className }) => {
  return (
    <header className={cn("w-full text-center py-8", className)}>
      <div className="animate-fade-in">
        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-medium tracking-wider mb-3">
          FLASHCARDS
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
        )}
      </div>
    </header>
  );
};

export default Header;

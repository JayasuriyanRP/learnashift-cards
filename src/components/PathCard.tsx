
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Atom, Code, FileCode, Palette } from 'lucide-react';

interface PathCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const PathCard: React.FC<PathCardProps> = ({
  id,
  title,
  description,
  icon,
  color
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'Code':
        return <Code className="h-6 w-6" />;
      case 'FileCode':
        return <FileCode className="h-6 w-6" />;
      case 'Atom':
        return <Atom className="h-6 w-6" />;
      case 'Palette':
        return <Palette className="h-6 w-6" />;
      default:
        return <Code className="h-6 w-6" />;
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'sky':
        return 'bg-sky-100 text-sky-600 border-sky-200 hover:bg-sky-200';
      case 'yellow':
        return 'bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200';
      case 'blue':
        return 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200';
      case 'pink':
        return 'bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200';
      default:
        return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
    }
  };

  return (
    <Link 
      to={`/path/${id}`}
      className={cn(
        'block w-full p-6 rounded-lg border transition-all duration-300',
        'transform hover:translate-y-[-5px] hover:shadow-md',
        getColorClass()
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('rounded-full p-3 bg-white/80')}>
          {getIcon()}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default PathCard;

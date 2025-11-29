import React from 'react';
import { DishOption } from '../types';

interface DishSelectorProps {
  options: DishOption[];
  selectedId: string;
  onSelect: (id: 'tart' | 'ring') => void;
  disabled: boolean;
}

const DishSelector: React.FC<DishSelectorProps> = ({ options, selectedId, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          disabled={disabled}
          className={`
            relative overflow-hidden p-6 rounded-xl border text-left transition-all duration-300 group
            ${selectedId === option.id 
              ? 'bg-stone-800 border-gold-500/50 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
              : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* Active Indicator */}
          {selectedId === option.id && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold-500/20 to-transparent rounded-bl-3xl" />
          )}

          <h3 className={`text-xl font-serif mb-2 ${selectedId === option.id ? 'text-gold-400' : 'text-stone-300 group-hover:text-stone-100'}`}>
            {option.title}
          </h3>
          
          <div className="text-sm font-medium text-stone-400 mb-4 uppercase tracking-wider">
            {option.styleDescription}
          </div>

          <div className="flex flex-wrap gap-2">
            {option.ingredients.map((ing, i) => (
              <span 
                key={i} 
                className={`
                  text-xs px-2 py-1 rounded-md border 
                  ${selectedId === option.id 
                    ? 'bg-gold-500/10 border-gold-500/20 text-gold-200' 
                    : 'bg-stone-800 border-stone-700 text-stone-500'
                  }
                `}
              >
                {ing}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};

export default DishSelector;
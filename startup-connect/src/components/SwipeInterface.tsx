import React, { useState, useEffect } from 'react';
import { Startup } from '../types';
import StartupCard from './StartupCard';
import { 
  HeartIcon, 
  XMarkIcon,
  ArrowPathIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface SwipeInterfaceProps {
  startups: Startup[];
  onSwipe: (startupId: string, action: 'like' | 'pass') => void;
}

const SwipeInterface: React.FC<SwipeInterfaceProps> = ({ startups, onSwipe }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<{ startupId: string; action: 'like' | 'pass' }[]>([]);
  const { user } = useAuth();

  const currentStartup = startups[currentIndex];
  const nextStartup = startups[currentIndex + 1];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentStartup) return;

    const action = direction === 'right' ? 'like' : 'pass';
    onSwipe(currentStartup.id, action);
    
    setSwipeHistory(prev => [...prev, { startupId: currentStartup.id, action }]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleButtonSwipe = (action: 'like' | 'pass') => {
    handleSwipe(action === 'like' ? 'right' : 'left');
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0 || currentIndex === 0) return;
    
    setSwipeHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => prev - 1);
  };

  if (!currentStartup) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No more startups!</h2>
          <p className="text-gray-600 mb-6">
            You've reviewed all available opportunities. Check back later for new startups.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Discover Startups
            </h1>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} of {startups.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / startups.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative p-6">
        <div className="relative max-w-sm mx-auto h-full">
          {/* Next card (underneath) */}
          {nextStartup && (
            <div className="absolute inset-0 transform scale-95 opacity-50">
              <StartupCard 
                startup={nextStartup} 
                onSwipe={() => {}} 
                isTop={false}
              />
            </div>
          )}
          
          {/* Current card (on top) */}
          <StartupCard 
            startup={currentStartup} 
            onSwipe={handleSwipe} 
            isTop={true}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center gap-6">
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={swipeHistory.length === 0}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo last swipe"
          >
            <ArrowPathIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Pass Button */}
          <button
            onClick={() => handleButtonSwipe('pass')}
            className="p-4 rounded-full bg-red-100 hover:bg-red-200 transition-colors group"
            title="Pass on this startup"
          >
            <XMarkIcon className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleButtonSwipe('like')}
            className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition-colors group"
            title="Like this startup"
          >
            <HeartIcon className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
          <span>← Pass</span>
          <span>→ Like</span>
          <span>↑ Undo</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeInterface;
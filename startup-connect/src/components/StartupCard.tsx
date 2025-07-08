import React, { useState, useRef, useEffect } from 'react';
import { Startup } from '../types';
import { 
  MapPinIcon, 
  UserGroupIcon, 
  BanknotesIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface StartupCardProps {
  startup: Startup;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop?: boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup, onSwipe, isTop = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const getIndustryColor = (industry: string) => {
    const colors: { [key: string]: string } = {
      tech: 'bg-blue-500',
      fintech: 'bg-green-500',
      healthtech: 'bg-red-500',
      edtech: 'bg-purple-500',
      climate: 'bg-emerald-500',
      gaming: 'bg-pink-500',
      foodtech: 'bg-orange-500',
      ai: 'bg-indigo-500',
      blockchain: 'bg-yellow-500',
      saas: 'bg-cyan-500',
    };
    return colors[industry] || 'bg-gray-500';
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      idea: 'bg-gray-100 text-gray-800',
      mvp: 'bg-blue-100 text-blue-800',
      early: 'bg-green-100 text-green-800',
      growth: 'bg-purple-100 text-purple-800',
      scale: 'bg-orange-100 text-orange-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatFunding = (amount?: number) => {
    if (!amount) return 'Pre-seed';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTop) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isTop) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTop) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !isTop) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset.x, startPos]);

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) * 0.002);

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 ${isTop ? 'z-20 cursor-grab' : 'z-10'} ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="bg-white rounded-2xl shadow-2xl h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{startup.name}</h1>
              <p className="text-primary-100 text-sm mb-3">{startup.publicSummary}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStageColor(startup.stage)}`}>
                  {startup.stage.toUpperCase()}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getIndustryColor(startup.industry)}`}>
                  {startup.industry}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Location & Remote */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{startup.location}</span>
              </div>
              {startup.remoteOk && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Remote OK
                </span>
              )}
            </div>

            {/* Team Size & Funding */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Team Size</p>
                  <p className="text-sm font-medium text-gray-900">{startup.teamSize} people</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Funding</p>
                  <p className="text-sm font-medium text-gray-900">{formatFunding(startup.fundingRaised)}</p>
                </div>
              </div>
            </div>

            {/* Looking For */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <BuildingOfficeIcon className="h-4 w-4" />
                Looking for
              </h3>
              <div className="flex flex-wrap gap-2">
                {startup.lookingFor.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Compensation */}
            {(startup.salary || startup.equity) && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Compensation</h3>
                <div className="space-y-1">
                  {startup.salary && (
                    <p className="text-xs text-gray-600">
                      Salary: ${startup.salary.min.toLocaleString()} - ${startup.salary.max.toLocaleString()}
                    </p>
                  )}
                  {startup.equity && (
                    <p className="text-xs text-gray-600">
                      Equity: {startup.equity.min}% - {startup.equity.max}%
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Benefits */}
            {startup.benefits && startup.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Benefits</h3>
                <div className="flex flex-wrap gap-1">
                  {startup.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {startup.techStack && startup.techStack.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-1">
                  {startup.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Swipe Indicators */}
        {isDragging && (
          <>
            <div
              className={`absolute top-20 left-6 bg-red-500 text-white px-4 py-2 rounded-lg transform rotate-[-20deg] transition-opacity ${
                dragOffset.x < -50 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <XMarkIcon className="h-6 w-6" />
            </div>
            <div
              className={`absolute top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg transform rotate-[20deg] transition-opacity ${
                dragOffset.x > 50 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <CheckIcon className="h-6 w-6" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StartupCard;
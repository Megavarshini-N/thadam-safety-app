"use client";

import type { ReactNode } from 'react';
import { useApp } from '@/lib/app-context';
import type { AppScreen } from '@/lib/types';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  screen: AppScreen;
  isActive?: boolean;
  accentColor?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  screen, 
  isActive = false,
  accentColor = '#C7A0E8'
}: FeatureCardProps) {
  const { setCurrentScreen, settings } = useApp();
  
  const sizeClass = settings.elderMode ? 'p-6' : 'p-4';
  const textSizeClass = settings.elderMode ? 'text-lg' : 'text-sm';
  const iconSizeClass = settings.elderMode ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <button
      onClick={() => setCurrentScreen(screen)}
      className={`
        relative group w-full
        glass-card rounded-2xl ${sizeClass}
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        animate-float
        overflow-hidden
      `}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      {/* Neon border glow on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          boxShadow: `0 0 20px ${accentColor}40, inset 0 0 20px ${accentColor}10`
        }}
      />
      
      {/* Active indicator */}
      {isActive && (
        <div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
      )}
      
      {/* Icon container */}
      <div 
        className={`${iconSizeClass} rounded-xl flex items-center justify-center mb-3`}
        style={{ 
          backgroundColor: `${accentColor}20`,
          boxShadow: `0 0 20px ${accentColor}30`
        }}
      >
        <div style={{ color: accentColor }}>
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="font-semibold text-white text-left mb-1">{title}</h3>
      <p className={`${textSizeClass} text-[#DAD0EE] text-left leading-snug`}>{description}</p>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

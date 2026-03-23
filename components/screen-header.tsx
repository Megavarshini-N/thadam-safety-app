"use client";

import { useApp } from '@/lib/app-context';
import { ArrowLeft } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function ScreenHeader({ title, subtitle, showBack = true }: ScreenHeaderProps) {
  const { setCurrentScreen, settings } = useApp();

  return (
    <header className="flex items-center gap-4 mb-6">
      {showBack && (
        <button
          onClick={() => setCurrentScreen('home')}
          className="p-3 rounded-xl glass-card hover:bg-[#2A1248] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#C7A0E8]" />
        </button>
      )}
      <div>
        <h1 className={`${settings.elderMode ? 'text-3xl' : 'text-xl'} font-bold text-white`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`${settings.elderMode ? 'text-lg' : 'text-sm'} text-[#DAD0EE]`}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

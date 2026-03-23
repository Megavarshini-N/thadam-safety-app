"use client";

import React from "react"

import { useApp } from '@/lib/app-context';
import { Home, Map, Shield, Users, Settings } from 'lucide-react';
import type { AppScreen } from '@/lib/types';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  screen: AppScreen;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', screen: 'home' },
  { icon: Map, label: 'Routes', screen: 'route-tracker' },
  { icon: Shield, label: 'Zones', screen: 'geofencing' },
  { icon: Users, label: 'Guardians', screen: 'guardians' },
  { icon: Settings, label: 'Settings', screen: 'settings' },
];

export function BottomNav() {
  const { currentScreen, setCurrentScreen, settings } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient blur background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D021F] via-[#0D021F]/95 to-transparent backdrop-blur-lg" />
      
      <div className="relative max-w-md mx-auto px-2 pb-6 pt-2">
        <div className="glass-card rounded-2xl border border-[#3D1A5C] p-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.screen || 
                (item.screen === 'home' && ['silent-sos', 'auto-danger', 'fake-call'].includes(currentScreen));
              
              return (
                <button
                  key={item.screen}
                  onClick={() => setCurrentScreen(item.screen)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-[#C7A0E8]/20' 
                      : 'hover:bg-[#2A1248]'}
                  `}
                >
                  <div className={`
                    relative p-2 rounded-xl transition-all
                    ${isActive ? 'bg-[#C7A0E8]/30' : ''}
                  `}>
                    <Icon className={`
                      ${settings.elderMode ? 'w-7 h-7' : 'w-5 h-5'}
                      ${isActive ? 'text-[#C7A0E8]' : 'text-[#DAD0EE]/60'}
                      transition-colors
                    `} />
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl animate-pulse-glow opacity-50" />
                    )}
                  </div>
                  <span className={`
                    ${settings.elderMode ? 'text-sm' : 'text-xs'} 
                    ${isActive ? 'text-[#C7A0E8]' : 'text-[#DAD0EE]/60'}
                    font-medium transition-colors
                  `}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

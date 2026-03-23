"use client";

import { useState } from 'react';
import { useApp } from '@/lib/app-context';

export function SOSOrb() {
  const { triggerPreSOS } = useApp();
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 1500) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        triggerPreSOS('manual');
        setHoldProgress(0);
        setIsPressed(false);
      }
    }, 50);
    setHoldTimer(timer);
  };

  const handlePressEnd = () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
    setIsPressed(false);
    setHoldProgress(0);
  };

  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Outer ripple rings */}
      <div className="absolute w-72 h-72 rounded-full bg-[#C7A0E8]/5 animate-ripple" style={{ animationDelay: '0s' }} />
      <div className="absolute w-72 h-72 rounded-full bg-[#C7A0E8]/5 animate-ripple" style={{ animationDelay: '0.5s' }} />
      <div className="absolute w-72 h-72 rounded-full bg-[#C7A0E8]/5 animate-ripple" style={{ animationDelay: '1s' }} />
      
      {/* Glow backdrop */}
      <div className="absolute w-56 h-56 rounded-full bg-[#C7A0E8]/20 blur-3xl" />
      
      {/* Progress ring */}
      {holdProgress > 0 && (
        <svg className="absolute w-52 h-52 -rotate-90">
          <circle
            cx="104"
            cy="104"
            r="96"
            fill="none"
            stroke="#EE44FF"
            strokeWidth="4"
            strokeDasharray={`${(holdProgress / 100) * 603} 603`}
            className="transition-all duration-100"
          />
        </svg>
      )}
      
      {/* Main orb */}
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className={`
          relative w-44 h-44 rounded-full cursor-pointer
          bg-gradient-to-br from-[#C7A0E8] via-[#B57EDC] to-[#9B5DC9]
          flex items-center justify-center
          transition-all duration-300
          ${isPressed ? 'scale-95' : 'hover:scale-105'}
          animate-pulse-glow
        `}
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* SOS Text */}
        <div className="relative flex flex-col items-center">
          <span className="text-4xl font-bold text-white tracking-wider drop-shadow-lg">SOS</span>
          <span className="text-xs text-white/80 mt-1">Hold to activate</span>
        </div>
        
        {/* Shine effect */}
        <div className="absolute top-4 left-8 w-12 h-12 rounded-full bg-white/20 blur-xl" />
      </button>
      
      {/* Bottom indicator */}
      <div className="absolute -bottom-2 flex items-center gap-2 text-[#DAD0EE] text-sm">
        <div className="w-2 h-2 rounded-full bg-[#C7A0E8] animate-pulse" />
        <span>Protection Active</span>
      </div>
    </div>
  );
}

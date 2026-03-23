"use client";

import React from "react"

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/app-context';
import { Shield, X, AlertTriangle } from 'lucide-react';

export function PreSOSScreen() {
  const { cancelSOS, confirmSOS, settings } = useApp();
  const [countdown, setCountdown] = useState(settings.sosConfirmationTime);
  const [sliderValue, setSliderValue] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      confirmSOS();
      return;
    }
    
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, confirmSOS]);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current || !isDragging) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderValue(percentage);
    
    if (percentage >= 95) {
      cancelSOS();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => handleSliderMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleSliderMove(e.touches[0].clientX);

  const handleDragEnd = () => {
    setIsDragging(false);
    if (sliderValue < 95) {
      setSliderValue(0);
    }
  };

  // Calculate the circumference and offset for the countdown ring
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = ((settings.sosConfirmationTime - countdown) / settings.sosConfirmationTime) * circumference;

  return (
    <div className="fixed inset-0 bg-[#0D021F]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center px-4">
      {/* Pulsing background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#EE44FF]/10 rounded-full blur-[100px] animate-danger-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Warning icon */}
        <div className="mb-6">
          <AlertTriangle className="w-12 h-12 text-[#EE44FF] animate-pulse" />
        </div>

        {/* Title */}
        <h1 className={`${settings.elderMode ? 'text-3xl' : 'text-2xl'} font-bold text-white text-center mb-2`}>
          SOS Alert Pending
        </h1>
        <p className={`${settings.elderMode ? 'text-lg' : 'text-base'} text-[#DAD0EE] text-center mb-8`}>
          Emergency alert will be sent automatically
        </p>

        {/* Countdown Ring */}
        <div className="relative mb-8">
          <svg className="w-48 h-48 -rotate-90">
            {/* Background ring */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke="#2A1248"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke="#EE44FF"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: 'drop-shadow(0 0 10px #EE44FF)'
              }}
            />
          </svg>
          
          {/* Countdown number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${settings.elderMode ? 'text-6xl' : 'text-5xl'} font-bold text-white`}>
              {countdown}
            </span>
            <span className="text-[#DAD0EE] text-sm">seconds</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          {/* Slide to Cancel */}
          <div 
            ref={sliderRef}
            className="relative h-16 bg-[#1A0733] rounded-2xl overflow-hidden border border-[#C7A0E8]/30"
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
          >
            {/* Fill */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C7A0E8]/30 to-[#C7A0E8]/50"
              style={{ width: `${sliderValue}%` }}
            />
            
            {/* Slider knob */}
            <div
              className="absolute top-1 bottom-1 left-1 w-14 h-14 rounded-xl bg-gradient-to-br from-[#C7A0E8] to-[#B57EDC] flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform"
              style={{ transform: `translateX(${(sliderValue / 100) * (sliderRef.current?.clientWidth ? sliderRef.current.clientWidth - 60 : 200)}px)` }}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            
            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`${settings.elderMode ? 'text-lg' : 'text-base'} text-[#DAD0EE] font-medium ml-12`}>
                Slide to confirm safe
              </span>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={cancelSOS}
            className={`w-full ${settings.elderMode ? 'py-5 text-xl' : 'py-4 text-lg'} rounded-2xl glass-card border border-[#C7A0E8]/30 text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#2A1248] transition-colors`}
          >
            <X className="w-5 h-5" />
            I am Safe - Cancel SOS
          </button>

          {/* Send SOS Button */}
          <button
            onClick={confirmSOS}
            className={`w-full ${settings.elderMode ? 'py-5 text-xl' : 'py-4 text-lg'} rounded-2xl bg-[#EE44FF] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#EE44FF]/90 transition-colors animate-danger-pulse`}
          >
            <AlertTriangle className="w-5 h-5" />
            Send SOS Now
          </button>
        </div>

        {/* Info text */}
        <p className="mt-6 text-[#DAD0EE]/60 text-sm text-center">
          Your guardians will be notified with your location
        </p>
      </div>
    </div>
  );
}

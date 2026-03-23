"use client";

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Phone, MessageSquare, MapPin, CheckCircle, Users, X } from 'lucide-react';

export function SOSActiveScreen() {
  const { guardians, cancelSOS, settings, currentLocation } = useApp();
  const [notificationsSent, setNotificationsSent] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: MapPin, text: 'Capturing location...', complete: false },
    { icon: Phone, text: 'Alerting guardians...', complete: false },
    { icon: MessageSquare, text: 'Sending SMS alerts...', complete: false },
    { icon: Users, text: 'Emergency contacts notified', complete: false },
  ];

  useEffect(() => {
    // Simulate notification sequence
    const timers: NodeJS.Timeout[] = [];
    
    steps.forEach((_, index) => {
      timers.push(setTimeout(() => {
        setCurrentStep(index + 1);
        if (index < guardians.length) {
          setNotificationsSent(prev => [...prev, guardians[index]?.id || '']);
        }
      }, (index + 1) * 1500));
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [guardians]);

  return (
    <div className="fixed inset-0 bg-[#0D021F] z-50 flex flex-col">
      {/* Signal wave animation background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-40 h-40 rounded-full border-2 border-[#C7A0E8]/30"
              style={{
                animation: `ripple 2s ease-out infinite`,
                animationDelay: `${i * 0.4}s`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Success glow */}
      {currentStep >= 4 && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#C7A0E8]/20 rounded-full blur-[100px] animate-pulse" />
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {/* Status Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C7A0E8] to-[#B57EDC] flex items-center justify-center animate-pulse-glow">
            {currentStep >= 4 ? (
              <CheckCircle className="w-16 h-16 text-white" />
            ) : (
              <Phone className="w-16 h-16 text-white animate-pulse" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <h1 className={`${settings.elderMode ? 'text-3xl' : 'text-2xl'} font-bold text-white text-center mb-2`}>
          {currentStep >= 4 ? 'Help is on the way!' : 'SOS Alert Sending...'}
        </h1>
        <p className={`${settings.elderMode ? 'text-lg' : 'text-base'} text-[#DAD0EE] text-center mb-8`}>
          {currentStep >= 4 
            ? 'Your guardians have been notified with your location'
            : 'Please stay calm. Alerting your emergency contacts...'}
        </p>

        {/* Progress Steps */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isComplete = currentStep > index;
            const isCurrent = currentStep === index;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                  isComplete 
                    ? 'glass-card border border-[#C7A0E8]/50' 
                    : isCurrent 
                      ? 'glass-card border border-[#C7A0E8]/30 animate-pulse' 
                      : 'bg-[#1A0733]/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isComplete 
                    ? 'bg-[#C7A0E8]' 
                    : 'bg-[#2A1248]'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#C7A0E8]' : 'text-[#DAD0EE]/50'}`} />
                  )}
                </div>
                <span className={`${settings.elderMode ? 'text-lg' : 'text-base'} ${
                  isComplete ? 'text-white' : isCurrent ? 'text-[#DAD0EE]' : 'text-[#DAD0EE]/50'
                }`}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Notified Guardians */}
        {notificationsSent.length > 0 && (
          <div className="w-full max-w-sm">
            <h3 className="text-[#DAD0EE] text-sm mb-3">Notified Guardians:</h3>
            <div className="flex flex-wrap gap-2">
              {guardians.filter(g => notificationsSent.includes(g.id)).map(guardian => (
                <div
                  key={guardian.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-[#C7A0E8]/30 animate-slide-up"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: guardian.avatarColor }}
                  >
                    {guardian.name[0]}
                  </div>
                  <span className="text-white text-sm">{guardian.name}</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Info */}
        <div className="mt-8 glass-card rounded-2xl p-4 w-full max-w-sm">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#C7A0E8]" />
            <div>
              <p className="text-white text-sm font-medium">Your Location Shared</p>
              <p className="text-[#DAD0EE] text-xs">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      <div className="relative z-10 p-4 pb-8">
        <button
          onClick={cancelSOS}
          className={`w-full ${settings.elderMode ? 'py-5 text-xl' : 'py-4 text-lg'} rounded-2xl glass-card border border-[#C7A0E8]/30 text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#2A1248] transition-colors`}
        >
          <X className="w-5 h-5" />
          I am Safe Now - Cancel Alert
        </button>
      </div>
    </div>
  );
}

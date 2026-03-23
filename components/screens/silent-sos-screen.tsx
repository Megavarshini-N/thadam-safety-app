"use client";

import React from "react"

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { ScreenHeader } from '@/components/screen-header';
import { 
  VolumeX, 
  Volume2, 
  Headphones, 
  Fingerprint,
  Smartphone,
  Check,
  Info
} from 'lucide-react';

interface TriggerOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  pattern: string;
}

const triggers: TriggerOption[] = [
  {
    id: 'volume',
    title: 'Volume Button Pattern',
    description: 'Press volume up 3 times quickly',
    icon: <Volume2 className="w-5 h-5" />,
    pattern: 'Vol+ Vol+ Vol+',
  },
  {
    id: 'earbud',
    title: 'Earbud Double Tap',
    description: 'Double tap your wireless earbuds',
    icon: <Headphones className="w-5 h-5" />,
    pattern: 'Tap Tap',
  },
  {
    id: 'screen',
    title: 'Hidden Screen Gesture',
    description: 'Swipe from top-left corner down',
    icon: <Smartphone className="w-5 h-5" />,
    pattern: 'Corner Swipe',
  },
  {
    id: 'power',
    title: 'Power Button Press',
    description: 'Press power button 5 times',
    icon: <Fingerprint className="w-5 h-5" />,
    pattern: 'Power x5',
  },
];

export function SilentSOSScreen() {
  const { settings, triggerPreSOS } = useApp();
  const [enabledTriggers, setEnabledTriggers] = useState<string[]>(['volume', 'screen']);
  const [testMode, setTestMode] = useState(false);

  const toggleTrigger = (id: string) => {
    setEnabledTriggers(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const testTrigger = () => {
    setTestMode(true);
    setTimeout(() => {
      setTestMode(false);
      triggerPreSOS('pattern');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-[#C7A0E8]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        <ScreenHeader title="Silent SOS" subtitle="Discreet emergency triggers" />

        {/* Status Card */}
        <div className="glass-card rounded-2xl p-5 mb-6 border border-[#C7A0E8]/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#C7A0E8]/20 flex items-center justify-center">
                <VolumeX className="w-6 h-6 text-[#C7A0E8]" />
              </div>
              <div>
                <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white`}>
                  Silent Mode Active
                </h3>
                <p className="text-[#DAD0EE] text-sm">
                  {enabledTriggers.length} triggers enabled
                </p>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
          
          <p className="text-[#DAD0EE] text-sm leading-relaxed">
            Activate SOS without unlocking your phone. Perfect for situations 
            where you need help but cannot openly call for it.
          </p>
        </div>

        {/* Trigger Options */}
        <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mb-4`}>
          SOS Triggers
        </h3>
        
        <div className="space-y-3 mb-6">
          {triggers.map((trigger) => {
            const isEnabled = enabledTriggers.includes(trigger.id);
            
            return (
              <button
                key={trigger.id}
                onClick={() => toggleTrigger(trigger.id)}
                className={`
                  w-full p-4 rounded-2xl text-left transition-all duration-300
                  ${isEnabled 
                    ? 'glass-card border border-[#C7A0E8]/50' 
                    : 'bg-[#1A0733]/50 border border-transparent'}
                  hover:scale-[1.01]
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${isEnabled ? 'bg-[#C7A0E8]/20' : 'bg-[#2A1248]'}
                  `}>
                    <div className={isEnabled ? 'text-[#C7A0E8]' : 'text-[#DAD0EE]/50'}>
                      {trigger.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`${settings.elderMode ? 'text-lg' : 'text-base'} font-medium text-white mb-1`}>
                      {trigger.title}
                    </h4>
                    <p className="text-[#DAD0EE] text-sm">{trigger.description}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2A1248] text-xs text-[#C7A0E8]">
                      {trigger.pattern}
                    </div>
                  </div>
                  
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isEnabled 
                      ? 'border-[#C7A0E8] bg-[#C7A0E8]' 
                      : 'border-[#DAD0EE]/30'}
                  `}>
                    {isEnabled && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="glass-card rounded-2xl p-4 mb-6 border border-[#B57EDC]/30">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#B57EDC] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-white font-medium mb-1">How it works</h4>
              <p className="text-[#DAD0EE] text-sm leading-relaxed">
                When you trigger Silent SOS, you will have {settings.sosConfirmationTime} seconds 
                to cancel if it was accidental. If no action is taken, your guardians will be alerted 
                automatically with your location.
              </p>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={testTrigger}
          disabled={testMode}
          className={`
            w-full py-4 rounded-2xl font-semibold text-white
            ${testMode 
              ? 'bg-[#2A1248] cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#C7A0E8] to-[#B57EDC] hover:opacity-90'}
            transition-all duration-300
          `}
        >
          {testMode ? 'Testing...' : 'Test Silent SOS Trigger'}
        </button>
      </div>
    </div>
  );
}

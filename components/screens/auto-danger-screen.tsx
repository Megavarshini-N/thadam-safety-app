"use client";

import React from "react"

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { ScreenHeader } from '@/components/screen-header';
import { 
  Brain, 
  Activity,
  AlertTriangle,
  TrendingDown,
  RotateCcw,
  Timer,
  Gauge,
  Check,
  Zap
} from 'lucide-react';

interface DetectionFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sensitivity: 'low' | 'medium' | 'high';
}

const features: DetectionFeature[] = [
  {
    id: 'fall',
    title: 'Fall Detection',
    description: 'Detects sudden falls using accelerometer',
    icon: <TrendingDown className="w-5 h-5" />,
    sensitivity: 'high',
  },
  {
    id: 'jerk',
    title: 'Sudden Jerk',
    description: 'Identifies abrupt movements or impacts',
    icon: <Zap className="w-5 h-5" />,
    sensitivity: 'medium',
  },
  {
    id: 'immobility',
    title: 'Immobility Alert',
    description: 'Alerts after unusual stillness period',
    icon: <Timer className="w-5 h-5" />,
    sensitivity: 'medium',
  },
  {
    id: 'reverse',
    title: 'Reverse Movement',
    description: 'Detects unexpected direction changes',
    icon: <RotateCcw className="w-5 h-5" />,
    sensitivity: 'low',
  },
  {
    id: 'velocity',
    title: 'Velocity Drop',
    description: 'Monitors sudden speed decreases',
    icon: <Gauge className="w-5 h-5" />,
    sensitivity: 'low',
  },
];

export function AutoDangerScreen() {
  const { settings, updateSettings } = useApp();
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>(['fall', 'jerk', 'immobility']);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const toggleFeature = (id: string) => {
    setEnabledFeatures(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'high': return '#EE44FF';
      case 'medium': return '#C7A0E8';
      case 'low': return '#A982CF';
      default: return '#DAD0EE';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-[#B57EDC]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        <ScreenHeader title="Auto Danger AI" subtitle="Intelligent threat detection" />

        {/* AI Status Card */}
        <div className="glass-card rounded-2xl p-5 mb-6 border border-[#B57EDC]/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#B57EDC]/30 to-[#C7A0E8]/30 flex items-center justify-center relative">
                <Brain className="w-7 h-7 text-[#C7A0E8]" />
                {isMonitoring && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                )}
              </div>
              <div>
                <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white`}>
                  AI Protection
                </h3>
                <p className="text-[#DAD0EE] text-sm">
                  {isMonitoring ? 'Actively monitoring' : 'Paused'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`
                px-4 py-2 rounded-xl font-medium text-sm transition-all
                ${isMonitoring 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-[#2A1248] text-[#DAD0EE] border border-[#3D1A5C]'}
              `}
            >
              {isMonitoring ? 'Active' : 'Paused'}
            </button>
          </div>

          {/* Real-time stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#2A1248] rounded-xl p-3 text-center">
              <Activity className="w-5 h-5 text-[#C7A0E8] mx-auto mb-1" />
              <p className="text-white text-lg font-bold">Normal</p>
              <p className="text-[#DAD0EE] text-xs">Motion</p>
            </div>
            <div className="bg-[#2A1248] rounded-xl p-3 text-center">
              <Gauge className="w-5 h-5 text-[#C7A0E8] mx-auto mb-1" />
              <p className="text-white text-lg font-bold">2.3</p>
              <p className="text-[#DAD0EE] text-xs">km/h</p>
            </div>
            <div className="bg-[#2A1248] rounded-xl p-3 text-center">
              <AlertTriangle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-white text-lg font-bold">0</p>
              <p className="text-[#DAD0EE] text-xs">Alerts</p>
            </div>
          </div>
        </div>

        {/* Detection Features */}
        <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mb-4`}>
          Detection Features
        </h3>
        
        <div className="space-y-3 mb-6">
          {features.map((feature) => {
            const isEnabled = enabledFeatures.includes(feature.id);
            
            return (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`
                  w-full p-4 rounded-2xl text-left transition-all duration-300
                  ${isEnabled 
                    ? 'glass-card border border-[#B57EDC]/50' 
                    : 'bg-[#1A0733]/50 border border-transparent'}
                  hover:scale-[1.01]
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${isEnabled ? 'bg-[#B57EDC]/20' : 'bg-[#2A1248]'}
                  `}>
                    <div className={isEnabled ? 'text-[#B57EDC]' : 'text-[#DAD0EE]/50'}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`${settings.elderMode ? 'text-lg' : 'text-base'} font-medium text-white`}>
                        {feature.title}
                      </h4>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${getSensitivityColor(feature.sensitivity)}20`,
                          color: getSensitivityColor(feature.sensitivity)
                        }}
                      >
                        {feature.sensitivity}
                      </span>
                    </div>
                    <p className="text-[#DAD0EE] text-sm">{feature.description}</p>
                  </div>
                  
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isEnabled 
                      ? 'border-[#B57EDC] bg-[#B57EDC]' 
                      : 'border-[#DAD0EE]/30'}
                  `}>
                    {isEnabled && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sensitivity Slider */}
        <div className="glass-card rounded-2xl p-5 border border-[#B57EDC]/30">
          <h4 className="text-white font-medium mb-4">Overall Sensitivity</h4>
          <div className="flex items-center gap-4">
            <span className="text-[#DAD0EE] text-sm">Low</span>
            <div className="flex-1 h-2 bg-[#2A1248] rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-[#A982CF] via-[#C7A0E8] to-[#EE44FF] rounded-full" />
            </div>
            <span className="text-[#DAD0EE] text-sm">High</span>
          </div>
          <p className="mt-3 text-[#DAD0EE] text-xs">
            Higher sensitivity may cause more false alerts but provides better protection.
          </p>
        </div>
      </div>
    </div>
  );
}

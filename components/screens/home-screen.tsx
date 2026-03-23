"use client";

import { SOSOrb } from '@/components/sos-orb';
import { FeatureCard } from '@/components/feature-card';
import { useApp } from '@/lib/app-context';
import { 
  VolumeX, 
  Brain, 
  MapPin, 
  Route, 
  Users, 
  Phone,
  Settings,
  History
} from 'lucide-react';

export function HomeScreen() {
  const { settings, setCurrentScreen } = useApp();

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C7A0E8]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#B57EDC]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`${settings.elderMode ? 'text-4xl' : 'text-2xl'} font-bold text-white neon-text`}>
              THADAM
            </h1>
            <p className={`${settings.elderMode ? 'text-lg' : 'text-sm'} text-[#DAD0EE]`}>
              Your Intelligent Safety Companion
            </p>
          </div>
          <button 
            onClick={() => setCurrentScreen('settings')}
            className="p-3 rounded-xl glass-card hover:bg-[#2A1248] transition-colors"
          >
            <Settings className="w-5 h-5 text-[#C7A0E8]" />
          </button>
        </header>

        {/* SOS Orb */}
        <SOSOrb />

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <FeatureCard
            title="Silent SOS"
            description="Discreet emergency alert"
            icon={<VolumeX className="w-5 h-5" />}
            screen="silent-sos"
            accentColor="#C7A0E8"
            isActive
          />
          <FeatureCard
            title="Auto Danger AI"
            description="Smart threat detection"
            icon={<Brain className="w-5 h-5" />}
            screen="auto-danger"
            accentColor="#B57EDC"
            isActive
          />
          <FeatureCard
            title="Geofencing"
            description="Safe zone boundaries"
            icon={<MapPin className="w-5 h-5" />}
            screen="geofencing"
            accentColor="#D3B3FF"
          />
          <FeatureCard
            title="Route Tracker"
            description="Journey monitoring"
            icon={<Route className="w-5 h-5" />}
            screen="route-tracker"
            accentColor="#A982CF"
          />
          <FeatureCard
            title="Guardians"
            description="Emergency contacts"
            icon={<Users className="w-5 h-5" />}
            screen="guardians"
            accentColor="#C7A0E8"
          />
          <FeatureCard
            title="Fake Call"
            description="Emergency escape"
            icon={<Phone className="w-5 h-5" />}
            screen="fake-call"
            accentColor="#EE44FF"
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-8 glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C7A0E8]/20 flex items-center justify-center">
                <History className="w-5 h-5 text-[#C7A0E8]" />
              </div>
              <div>
                <p className="text-white font-medium">Safety Score</p>
                <p className="text-[#DAD0EE] text-sm">Based on your activity</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-[#C7A0E8]">98</span>
              <span className="text-[#DAD0EE] text-sm">/100</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-[#2A1248] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C7A0E8] to-[#B57EDC] rounded-full"
              style={{ width: '98%' }}
            />
          </div>
        </div>

        {/* Status indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[#DAD0EE]">GPS Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C7A0E8] animate-pulse" />
            <span className="text-[#DAD0EE]">AI Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}

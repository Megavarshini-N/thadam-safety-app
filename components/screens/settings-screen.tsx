"use client";

import React from "react"

import { useApp } from '@/lib/app-context';
import { ScreenHeader } from '@/components/screen-header';
import { 
  Moon, 
  Eye, 
  Brain, 
  Volume2, 
  Clock,
  Calculator,
  FileText,
  Accessibility,
  Shield,
  Bell
} from 'lucide-react';

export function SettingsScreen() {
  const { settings, updateSettings, setCurrentScreen } = useApp();

  const ToggleSwitch = ({ 
    value, 
    onChange 
  }: { 
    value: boolean; 
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`w-14 h-8 rounded-full transition-all ${
        value ? 'bg-[#C7A0E8]' : 'bg-[#3D1A5C]'
      }`}
    >
      <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
        value ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
  );

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    value,
    onChange,
    accentColor = '#C7A0E8'
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    value: boolean;
    onChange: () => void;
    accentColor?: string;
  }) => (
    <div className="glass-card rounded-2xl p-4 border border-[#3D1A5C]">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium">{title}</h4>
          <p className="text-[#DAD0EE] text-sm">{description}</p>
        </div>
        <ToggleSwitch value={value} onChange={onChange} />
      </div>
    </div>
  );

  const handleStealthModeToggle = () => {
    if (!settings.stealthMode) {
      // Enable stealth mode
      updateSettings({ stealthMode: true });
      setCurrentScreen(settings.stealthAppType === 'calculator' ? 'stealth-calculator' : 'stealth-notes');
    } else {
      updateSettings({ stealthMode: false });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#B57EDC]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        <ScreenHeader title="Settings" subtitle="Customize your protection" />

        <div className="space-y-4">
          {/* Safety Features */}
          <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mt-6 mb-3`}>
            Safety Features
          </h3>
          
          <SettingItem
            icon={Volume2}
            title="Silent SOS"
            description="Enable discreet emergency triggers"
            value={settings.silentSOSEnabled}
            onChange={() => updateSettings({ silentSOSEnabled: !settings.silentSOSEnabled })}
          />
          
          <SettingItem
            icon={Brain}
            title="Danger AI"
            description="Auto-detect threats with AI"
            value={settings.dangerAIEnabled}
            onChange={() => updateSettings({ dangerAIEnabled: !settings.dangerAIEnabled })}
            accentColor="#B57EDC"
          />
          
          <SettingItem
            icon={Bell}
            title="Auto-Learn Routes"
            description="Automatically learn your routine paths"
            value={settings.autoLearnRoutes}
            onChange={() => updateSettings({ autoLearnRoutes: !settings.autoLearnRoutes })}
            accentColor="#D3B3FF"
          />

          {/* Confirmation Time */}
          <div className="glass-card rounded-2xl p-4 border border-[#3D1A5C]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#EE44FF]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#EE44FF]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">SOS Confirmation Time</h4>
                <p className="text-[#DAD0EE] text-sm">Time to cancel before auto-send</p>
              </div>
              <span className="text-[#C7A0E8] font-bold">{settings.sosConfirmationTime}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={settings.sosConfirmationTime}
              onChange={(e) => updateSettings({ sosConfirmationTime: Number(e.target.value) })}
              className="w-full h-2 bg-[#2A1248] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#EE44FF]"
            />
          </div>

          {/* Privacy */}
          <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mt-6 mb-3`}>
            Privacy
          </h3>

          <SettingItem
            icon={Eye}
            title="Stealth Mode"
            description="Disguise app as calculator or notes"
            value={settings.stealthMode}
            onChange={handleStealthModeToggle}
            accentColor="#A982CF"
          />

          {/* Stealth App Type */}
          <div className="glass-card rounded-2xl p-4 border border-[#3D1A5C]">
            <h4 className="text-white font-medium mb-3">Stealth App Disguise</h4>
            <div className="flex gap-3">
              <button
                onClick={() => updateSettings({ stealthAppType: 'calculator' })}
                className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  settings.stealthAppType === 'calculator' 
                    ? 'bg-[#C7A0E8] text-[#0D021F]' 
                    : 'bg-[#2A1248] text-[#DAD0EE]'
                }`}
              >
                <Calculator className="w-6 h-6" />
                <span className="text-sm font-medium">Calculator</span>
              </button>
              <button
                onClick={() => updateSettings({ stealthAppType: 'notes' })}
                className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  settings.stealthAppType === 'notes' 
                    ? 'bg-[#C7A0E8] text-[#0D021F]' 
                    : 'bg-[#2A1248] text-[#DAD0EE]'
                }`}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm font-medium">Notes</span>
              </button>
            </div>
            <p className="text-[#DAD0EE]/60 text-xs mt-3 text-center">
              Tap title 3 times quickly to unlock THADAM
            </p>
          </div>

          {/* Accessibility */}
          <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mt-6 mb-3`}>
            Accessibility
          </h3>

          <SettingItem
            icon={Accessibility}
            title="Elder Mode"
            description="Larger text, buttons & simplified UI"
            value={settings.elderMode}
            onChange={() => updateSettings({ elderMode: !settings.elderMode })}
            accentColor="#C7A0E8"
          />

          {/* About */}
          <div className="glass-card rounded-2xl p-5 border border-[#3D1A5C] mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C7A0E8] to-[#B57EDC] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">THADAM</h4>
                <p className="text-[#DAD0EE] text-sm">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-[#DAD0EE] text-sm">
              Your Intelligent Safety Companion. Protecting you with AI-powered 
              threat detection, smart routing, and instant emergency alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

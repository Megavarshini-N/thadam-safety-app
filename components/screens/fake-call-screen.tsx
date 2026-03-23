"use client";

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { ScreenHeader } from '@/components/screen-header';
import { 
  Phone, 
  Clock, 
  User,
  Shield,
  AlertTriangle,
  Edit3
} from 'lucide-react';

const callerOptions = [
  { id: 'dad', label: 'Dad', icon: '👨' },
  { id: 'mom', label: 'Mom', icon: '👩' },
  { id: 'police', label: 'Police', icon: '👮' },
  { id: 'custom', label: 'Custom', icon: '✏️' },
];

const delayOptions = [
  { value: 5, label: '5 sec' },
  { value: 10, label: '10 sec' },
  { value: 20, label: '20 sec' },
  { value: 30, label: '30 sec' },
];

export function FakeCallScreen() {
  const { settings, triggerFakeCall } = useApp();
  const [selectedCaller, setSelectedCaller] = useState<'dad' | 'mom' | 'police' | 'custom'>('dad');
  const [selectedDelay, setSelectedDelay] = useState(10);
  const [customName, setCustomName] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleScheduleCall = () => {
    setIsScheduled(true);
    setCountdown(selectedDelay);
    
    const callerName = selectedCaller === 'custom' ? customName : 
      selectedCaller === 'dad' ? 'Dad' : 
      selectedCaller === 'mom' ? 'Mom' : 'Emergency Services';
    
    triggerFakeCall({
      callerName,
      callerType: selectedCaller,
      delay: selectedDelay,
      customName: selectedCaller === 'custom' ? customName : undefined,
    });

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setIsScheduled(false);
    setCountdown(null);
  };

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-[#EE44FF]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        <ScreenHeader title="Fake Call" subtitle="Emergency escape option" />

        {/* Info Card */}
        <div className="glass-card rounded-2xl p-4 mb-6 border border-[#EE44FF]/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EE44FF]/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#EE44FF]" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">How it works</h3>
              <p className="text-[#DAD0EE] text-sm leading-relaxed">
                Schedule a fake incoming call to help you escape uncomfortable 
                situations. The call looks and sounds completely realistic.
              </p>
            </div>
          </div>
        </div>

        {isScheduled ? (
          <div className="glass-card rounded-2xl p-6 border border-[#EE44FF]/50 text-center animate-slide-up">
            <div className="w-24 h-24 rounded-full bg-[#EE44FF]/20 mx-auto mb-4 flex items-center justify-center animate-danger-pulse">
              <Phone className="w-12 h-12 text-[#EE44FF]" />
            </div>
            <h3 className={`${settings.elderMode ? 'text-2xl' : 'text-xl'} font-bold text-white mb-2`}>
              Call Scheduled
            </h3>
            <p className="text-[#DAD0EE] mb-4">
              {countdown !== null ? (
                <>Incoming call in <span className="text-[#EE44FF] font-bold">{countdown}</span> seconds</>
              ) : (
                'Call will arrive shortly...'
              )}
            </p>
            <button
              onClick={handleCancel}
              className="w-full py-4 rounded-2xl bg-[#2A1248] border border-[#3D1A5C] text-white font-semibold hover:bg-[#3D1A5C] transition-colors"
            >
              Cancel Call
            </button>
          </div>
        ) : (
          <>
            {/* Caller Selection */}
            <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mb-3`}>
              Select Caller
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {callerOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedCaller(option.id as typeof selectedCaller)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                    selectedCaller === option.id 
                      ? 'glass-card border border-[#EE44FF]/50' 
                      : 'bg-[#1A0733]/50 border border-transparent hover:bg-[#2A1248]'
                  }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className={`font-medium ${selectedCaller === option.id ? 'text-white' : 'text-[#DAD0EE]'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Name Input */}
            {selectedCaller === 'custom' && (
              <div className="mb-6 animate-slide-up">
                <label className="text-[#DAD0EE] text-sm mb-2 block">Custom Caller Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter caller name"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-[#2A1248] border border-[#3D1A5C] text-white placeholder:text-[#DAD0EE]/50 focus:outline-none focus:border-[#EE44FF]"
                  />
                  <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DAD0EE]/50" />
                </div>
              </div>
            )}

            {/* Delay Selection */}
            <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mb-3`}>
              Call Delay
            </h3>
            <div className="flex gap-2 mb-6">
              {delayOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDelay(option.value)}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    selectedDelay === option.value 
                      ? 'bg-[#EE44FF] text-white' 
                      : 'bg-[#2A1248] text-[#DAD0EE]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className={settings.elderMode ? 'text-base' : 'text-sm'}>{option.label}</span>
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="glass-card rounded-2xl p-4 mb-6 border border-[#3D1A5C]">
              <h4 className="text-[#DAD0EE] text-sm mb-3">Call Preview</h4>
              <div className="flex items-center gap-4 bg-[#2A1248] rounded-xl p-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EE44FF] to-[#B57EDC] flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {selectedCaller === 'custom' 
                      ? (customName || 'Custom Name') 
                      : selectedCaller === 'dad' 
                        ? 'Dad' 
                        : selectedCaller === 'mom' 
                          ? 'Mom' 
                          : 'Emergency Services'}
                  </p>
                  <p className="text-[#DAD0EE] text-sm">Incoming Call...</p>
                </div>
              </div>
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleScheduleCall}
              disabled={selectedCaller === 'custom' && !customName}
              className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                selectedCaller !== 'custom' || customName 
                  ? 'bg-gradient-to-r from-[#EE44FF] to-[#B57EDC] text-white hover:opacity-90' 
                  : 'bg-[#2A1248] text-[#DAD0EE]/50 cursor-not-allowed'
              }`}
            >
              <Phone className="w-5 h-5" />
              Schedule Fake Call
            </button>

            {/* Warning */}
            <div className="mt-4 flex items-start gap-2 text-[#DAD0EE]/60 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Use this feature responsibly. It is designed to help you safely exit uncomfortable situations.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

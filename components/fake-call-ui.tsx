"use client";

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { Phone, PhoneOff, Volume2 } from 'lucide-react';

export function FakeCallUI() {
  const { isFakeCallActive, fakeCallConfig, endFakeCall } = useApp();
  const [callDuration, setCallDuration] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    if (!isFakeCallActive) {
      setCallDuration(0);
      setIsAnswered(false);
      return;
    }
  }, [isFakeCallActive]);

  useEffect(() => {
    if (!isAnswered) return;
    
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnswered]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    setIsAnswered(true);
  };

  const handleDecline = () => {
    endFakeCall();
  };

  const handleHangup = () => {
    endFakeCall();
  };

  if (!isFakeCallActive || !fakeCallConfig) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#1A0733] to-[#0D021F]">
      {/* Incoming Call UI */}
      {!isAnswered ? (
        <div className="h-full flex flex-col items-center justify-between py-16 px-8">
          {/* Caller Info */}
          <div className="text-center">
            <p className="text-[#DAD0EE] text-lg mb-2">Incoming Call</p>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C7A0E8] to-[#B57EDC] mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
              <span className="text-5xl text-white font-bold">
                {fakeCallConfig.callerName[0]}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{fakeCallConfig.callerName}</h1>
            <p className="text-[#DAD0EE]">Mobile</p>
          </div>

          {/* Ripple Animation */}
          <div className="relative">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-24 h-24 rounded-full border border-[#C7A0E8]/30"
                style={{
                  animation: 'ripple 2s ease-out infinite',
                  animationDelay: `${i * 0.5}s`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>

          {/* Call Actions */}
          <div className="flex items-center gap-12">
            {/* Decline */}
            <button
              onClick={handleDecline}
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
              style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>

            {/* Answer */}
            <button
              onClick={handleAnswer}
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors animate-pulse"
              style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
            >
              <Phone className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      ) : (
        /* Active Call UI */
        <div className="h-full flex flex-col items-center justify-between py-16 px-8">
          {/* Call Info */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C7A0E8] to-[#B57EDC] mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">
                {fakeCallConfig.callerName[0]}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{fakeCallConfig.callerName}</h1>
            <p className="text-[#C7A0E8] text-xl">{formatDuration(callDuration)}</p>
          </div>

          {/* Call Controls */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                isMuted ? 'bg-[#C7A0E8]/30' : 'bg-[#2A1248]'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isMuted ? 'bg-[#C7A0E8]' : 'bg-[#3D1A5C]'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  {isMuted && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />}
                </svg>
              </div>
              <span className="text-white text-sm">mute</span>
            </button>

            {/* Keypad */}
            <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2A1248]">
              <div className="w-12 h-12 rounded-full bg-[#3D1A5C] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
              <span className="text-white text-sm">keypad</span>
            </button>

            {/* Speaker */}
            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                isSpeaker ? 'bg-[#C7A0E8]/30' : 'bg-[#2A1248]'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isSpeaker ? 'bg-[#C7A0E8]' : 'bg-[#3D1A5C]'
              }`}>
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-sm">speaker</span>
            </button>
          </div>

          {/* Hang Up */}
          <button
            onClick={handleHangup}
            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
            style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

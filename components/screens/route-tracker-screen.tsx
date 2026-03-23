"use client";

import React from "react"

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { ScreenHeader } from '@/components/screen-header';
import { MapView } from '@/components/map-view';
import { 
  Route, 
  Play, 
  Square, 
  Map,
  Calendar,
  Clock,
  Navigation,
  Brain,
  Home,
  Briefcase,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

type TabType = 'record' | 'learn' | 'manual' | 'view' | 'history';

export function RouteTrackerScreen() {
  const { 
    settings, 
    currentRoute, 
    routineRoutes,
    pastRoutes,
    isRecordingRoute, 
    startRecordingRoute, 
    stopRecordingRoute,
    addRoutePoint,
    currentLocation,
    saveRoutineRoute
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<TabType>('view');
  const [learningDays, setLearningDays] = useState(0);
  const [isLearning, setIsLearning] = useState(false);
  const [selectedStart, setSelectedStart] = useState<'home' | 'work' | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<'home' | 'work' | null>(null);

  // Simulate route recording
  useEffect(() => {
    if (!isRecordingRoute) return;
    
    const interval = setInterval(() => {
      const lastPoint = currentRoute[currentRoute.length - 1] || currentLocation;
      addRoutePoint({
        lat: lastPoint.lat + (Math.random() - 0.5) * 0.001,
        lng: lastPoint.lng + (Math.random() - 0.5) * 0.001,
        timestamp: Date.now(),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecordingRoute, currentRoute, currentLocation, addRoutePoint]);

  // Simulate learning progress
  useEffect(() => {
    if (!isLearning) return;
    
    const interval = setInterval(() => {
      setLearningDays(prev => {
        if (prev >= 7) {
          setIsLearning(false);
          return 7;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLearning]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'view', label: 'Live', icon: <Map className="w-4 h-4" /> },
    { id: 'record', label: 'Record', icon: <Route className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <Brain className="w-4 h-4" /> },
    { id: 'manual', label: 'Manual', icon: <Navigation className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Calendar className="w-4 h-4" /> },
  ];

  const handleSaveManualRoute = () => {
    if (!selectedStart || !selectedEnd) return;
    saveRoutineRoute({
      name: `${selectedStart} to ${selectedEnd}`,
      startLat: currentLocation.lat,
      startLng: currentLocation.lng,
      endLat: currentLocation.lat + 0.05,
      endLng: currentLocation.lng + 0.03,
      polylinePoints: [],
      typicalDuration: 30,
      allowedDeviation: 100,
    });
  };

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        <ScreenHeader title="Route Tracker" subtitle="Journey monitoring system" />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'bg-[#C7A0E8] text-[#0D021F] font-semibold' 
                  : 'glass-card text-[#DAD0EE] hover:bg-[#2A1248]'}
              `}
            >
              {tab.icon}
              <span className={settings.elderMode ? 'text-base' : 'text-sm'}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Map View */}
        <div className="h-64 mb-4 rounded-2xl overflow-hidden border border-[#3D1A5C]">
          <MapView
            currentLocation={currentLocation}
            currentRoute={currentRoute}
            routineRoute={routineRoutes[0]}
            isRecording={isRecordingRoute}
            showCurrentLocation
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'view' && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4 border border-[#A982CF]/30">
              <h3 className="text-white font-medium mb-3">Current Journey</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#2A1248] rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 text-[#C7A0E8] mx-auto mb-1" />
                  <p className="text-white text-lg font-bold">12m</p>
                  <p className="text-[#DAD0EE] text-xs">Duration</p>
                </div>
                <div className="bg-[#2A1248] rounded-xl p-3 text-center">
                  <Navigation className="w-5 h-5 text-[#C7A0E8] mx-auto mb-1" />
                  <p className="text-white text-lg font-bold">1.2km</p>
                  <p className="text-[#DAD0EE] text-xs">Distance</p>
                </div>
                <div className="bg-[#2A1248] rounded-xl p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-white text-lg font-bold">On</p>
                  <p className="text-[#DAD0EE] text-xs">Route</p>
                </div>
              </div>
            </div>

            {/* Route Legend */}
            <div className="glass-card rounded-2xl p-4 border border-[#A982CF]/30">
              <h3 className="text-white font-medium mb-3">Route Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 rounded-full bg-[#C7A0E8]" />
                  <span className="text-[#DAD0EE] text-sm">Routine Route</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 rounded-full bg-[#D3B3FF]" />
                  <span className="text-[#DAD0EE] text-sm">Current Live Route</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 rounded-full bg-[#EE44FF]" />
                  <span className="text-[#DAD0EE] text-sm">Deviation Path</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'record' && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-[#C7A0E8]/30 text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isRecordingRoute 
                  ? 'bg-[#EE44FF]/20 animate-danger-pulse' 
                  : 'bg-[#C7A0E8]/20'
              }`}>
                {isRecordingRoute ? (
                  <Square className="w-8 h-8 text-[#EE44FF]" />
                ) : (
                  <Play className="w-8 h-8 text-[#C7A0E8] ml-1" />
                )}
              </div>
              
              <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mb-2`}>
                {isRecordingRoute ? 'Recording Trip...' : 'Record Routine Trip'}
              </h3>
              <p className="text-[#DAD0EE] text-sm mb-4">
                {isRecordingRoute 
                  ? `${currentRoute.length} points captured`
                  : 'Start recording to save this route as a routine'}
              </p>
              
              <button
                onClick={isRecordingRoute ? stopRecordingRoute : startRecordingRoute}
                className={`
                  w-full py-4 rounded-2xl font-semibold text-white transition-all
                  ${isRecordingRoute 
                    ? 'bg-[#EE44FF] hover:bg-[#EE44FF]/90' 
                    : 'bg-gradient-to-r from-[#C7A0E8] to-[#B57EDC] hover:opacity-90'}
                `}
              >
                {isRecordingRoute ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-[#B57EDC]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#B57EDC]/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#B57EDC]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Auto-Learn Routine</h3>
                  <p className="text-[#DAD0EE] text-sm">AI observes your daily patterns</p>
                </div>
              </div>
              
              {isLearning ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#DAD0EE]">Learning progress</span>
                      <span className="text-[#B57EDC]">Day {learningDays}/7</span>
                    </div>
                    <div className="h-2 bg-[#2A1248] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#B57EDC] to-[#C7A0E8] rounded-full transition-all duration-500"
                        style={{ width: `${(learningDays / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[#DAD0EE] text-sm mb-4">
                    {learningDays >= 3 
                      ? 'Pattern detected! Routine route will be saved automatically.'
                      : 'Analyzing your daily travel patterns...'}
                  </p>
                </>
              ) : (
                <p className="text-[#DAD0EE] text-sm mb-4">
                  Enable auto-learn to let AI observe your routes for 5-7 days. 
                  Routes with 60%+ overlap will be saved as routines.
                </p>
              )}
              
              <button
                onClick={() => setIsLearning(!isLearning)}
                className={`
                  w-full py-4 rounded-2xl font-semibold transition-all
                  ${isLearning 
                    ? 'bg-[#2A1248] text-[#DAD0EE] border border-[#3D1A5C]' 
                    : 'bg-gradient-to-r from-[#B57EDC] to-[#C7A0E8] text-white'}
                `}
              >
                {isLearning ? 'Stop Learning' : 'Start Auto-Learn'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-[#D3B3FF]/30">
              <h3 className="text-white font-semibold mb-4">Set Route Manually</h3>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[#DAD0EE] text-sm mb-2 block">Starting Point</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedStart('home')}
                      className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        selectedStart === 'home' 
                          ? 'bg-[#C7A0E8] text-[#0D021F]' 
                          : 'bg-[#2A1248] text-[#DAD0EE]'
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      Home
                    </button>
                    <button
                      onClick={() => setSelectedStart('work')}
                      className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        selectedStart === 'work' 
                          ? 'bg-[#C7A0E8] text-[#0D021F]' 
                          : 'bg-[#2A1248] text-[#DAD0EE]'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      Work
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-[#DAD0EE] text-sm mb-2 block">Destination</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedEnd('work')}
                      className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        selectedEnd === 'work' 
                          ? 'bg-[#C7A0E8] text-[#0D021F]' 
                          : 'bg-[#2A1248] text-[#DAD0EE]'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      Work
                    </button>
                    <button
                      onClick={() => setSelectedEnd('home')}
                      className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        selectedEnd === 'home' 
                          ? 'bg-[#C7A0E8] text-[#0D021F]' 
                          : 'bg-[#2A1248] text-[#DAD0EE]'
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      Home
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSaveManualRoute}
                disabled={!selectedStart || !selectedEnd}
                className={`
                  w-full py-4 rounded-2xl font-semibold transition-all
                  ${selectedStart && selectedEnd 
                    ? 'bg-gradient-to-r from-[#D3B3FF] to-[#C7A0E8] text-[#0D021F]' 
                    : 'bg-[#2A1248] text-[#DAD0EE]/50 cursor-not-allowed'}
                `}
              >
                Save as Routine Route
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {pastRoutes.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-[#3D1A5C] text-center">
                <Calendar className="w-12 h-12 text-[#DAD0EE]/30 mx-auto mb-3" />
                <p className="text-[#DAD0EE]">No route history yet</p>
                <p className="text-[#DAD0EE]/60 text-sm mt-1">
                  Start recording trips to build your history
                </p>
              </div>
            ) : (
              pastRoutes.map((route, i) => (
                <div key={route.id} className="glass-card rounded-2xl p-4 border border-[#A982CF]/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">
                      {route.date.toLocaleDateString()}
                    </span>
                    {route.deviations.length > 0 && (
                      <span className="px-2 py-1 rounded-lg bg-[#EE44FF]/20 text-[#EE44FF] text-xs">
                        {route.deviations.length} deviations
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#DAD0EE]">
                    <span>{route.polylinePoints.length} points</span>
                    <span>{route.duration}min</span>
                    <span>{route.distance}km</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

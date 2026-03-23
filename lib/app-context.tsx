"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { 
  AppScreen, 
  Guardian, 
  SafeZone, 
  RoutineRoute, 
  PastRoute, 
  SOSEvent, 
  AppSettings,
  Coordinate,
  FakeCallConfig
} from './types';

interface AppContextType {
  // Navigation
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  
  // Guardians
  guardians: Guardian[];
  addGuardian: (guardian: Omit<Guardian, 'id'>) => void;
  removeGuardian: (id: string) => void;
  
  // Safe Zones
  safeZones: SafeZone[];
  addSafeZone: (zone: Omit<SafeZone, 'id'>) => void;
  removeSafeZone: (id: string) => void;
  toggleSafeZone: (id: string) => void;
  
  // Routes
  routineRoutes: RoutineRoute[];
  pastRoutes: PastRoute[];
  currentRoute: Coordinate[];
  isRecordingRoute: boolean;
  startRecordingRoute: () => void;
  stopRecordingRoute: () => void;
  addRoutePoint: (point: Coordinate) => void;
  saveRoutineRoute: (route: Omit<RoutineRoute, 'id' | 'createdAt'>) => void;
  
  // SOS
  sosEvents: SOSEvent[];
  isSOSActive: boolean;
  preSOSCountdown: number | null;
  triggerPreSOS: (type: SOSEvent['triggerType']) => void;
  cancelSOS: () => void;
  confirmSOS: () => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Fake Call
  fakeCallConfig: FakeCallConfig | null;
  triggerFakeCall: (config: FakeCallConfig) => void;
  endFakeCall: () => void;
  isFakeCallActive: boolean;
  
  // Current Location (simulated)
  currentLocation: Coordinate;
  setCurrentLocation: (location: Coordinate) => void;
}

const defaultSettings: AppSettings = {
  elderMode: false,
  stealthMode: false,
  stealthAppType: 'calculator',
  autoLearnRoutes: true,
  silentSOSEnabled: true,
  dangerAIEnabled: true,
  sosConfirmationTime: 10,
};

const defaultGuardians: Guardian[] = [
  {
    id: '1',
    name: 'Sarah (Mom)',
    phoneNumber: '+1 234-567-8901',
    relationship: 'Mother',
    isEmergencyContact: true,
    avatarColor: '#C7A0E8',
  },
  {
    id: '2',
    name: 'James (Dad)',
    phoneNumber: '+1 234-567-8902',
    relationship: 'Father',
    isEmergencyContact: true,
    avatarColor: '#B57EDC',
  },
];

// Coimbatore, Tamil Nadu default coordinates
const COIMBATORE_CENTER = { lat: 11.0261194, lng: 77.0191128 };

const defaultSafeZones: SafeZone[] = [
  {
    id: '1',
    name: 'Home',
    centerLat: 11.0261194,
    centerLng: 77.0191128,
    radius: 200,
    isActive: true,
  },
  {
    id: '2',
    name: 'Office',
    centerLat: 11.0168,
    centerLng: 76.9558,
    radius: 150,
    isActive: true,
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [guardians, setGuardians] = useState<Guardian[]>(defaultGuardians);
  const [safeZones, setSafeZones] = useState<SafeZone[]>(defaultSafeZones);
  const [routineRoutes, setRoutineRoutes] = useState<RoutineRoute[]>([]);
  const [pastRoutes, setPastRoutes] = useState<PastRoute[]>([]);
  const [currentRoute, setCurrentRoute] = useState<Coordinate[]>([]);
  const [isRecordingRoute, setIsRecordingRoute] = useState(false);
  const [sosEvents, setSOSEvents] = useState<SOSEvent[]>([]);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [preSOSCountdown, setPreSOSCountdown] = useState<number | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [fakeCallConfig, setFakeCallConfig] = useState<FakeCallConfig | null>(null);
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinate>(COIMBATORE_CENTER);

  const addGuardian = useCallback((guardian: Omit<Guardian, 'id'>) => {
    setGuardians(prev => [...prev, { ...guardian, id: Date.now().toString() }]);
  }, []);

  const removeGuardian = useCallback((id: string) => {
    setGuardians(prev => prev.filter(g => g.id !== id));
  }, []);

  const addSafeZone = useCallback((zone: Omit<SafeZone, 'id'>) => {
    setSafeZones(prev => [...prev, { ...zone, id: Date.now().toString() }]);
  }, []);

  const removeSafeZone = useCallback((id: string) => {
    setSafeZones(prev => prev.filter(z => z.id !== id));
  }, []);

  const toggleSafeZone = useCallback((id: string) => {
    setSafeZones(prev => prev.map(z => z.id === id ? { ...z, isActive: !z.isActive } : z));
  }, []);

  const startRecordingRoute = useCallback(() => {
    setIsRecordingRoute(true);
    setCurrentRoute([]);
  }, []);

  const stopRecordingRoute = useCallback(() => {
    setIsRecordingRoute(false);
    if (currentRoute.length > 0) {
      setPastRoutes(prev => [...prev, {
        id: Date.now().toString(),
        date: new Date(),
        polylinePoints: currentRoute,
        deviations: [],
        duration: 0,
        distance: 0,
      }]);
    }
  }, [currentRoute]);

  const addRoutePoint = useCallback((point: Coordinate) => {
    setCurrentRoute(prev => [...prev, point]);
  }, []);

  const saveRoutineRoute = useCallback((route: Omit<RoutineRoute, 'id' | 'createdAt'>) => {
    setRoutineRoutes(prev => [...prev, { ...route, id: Date.now().toString(), createdAt: new Date() }]);
  }, []);

  const triggerPreSOS = useCallback((type: SOSEvent['triggerType']) => {
    setPreSOSCountdown(settings.sosConfirmationTime);
    setCurrentScreen('pre-sos');
  }, [settings.sosConfirmationTime]);

  const cancelSOS = useCallback(() => {
    setPreSOSCountdown(null);
    setIsSOSActive(false);
    setCurrentScreen('home');
  }, []);

  const confirmSOS = useCallback(() => {
    setPreSOSCountdown(null);
    setIsSOSActive(true);
    setCurrentScreen('sos-active');
    setSOSEvents(prev => [...prev, {
      id: Date.now().toString(),
      triggeredAt: new Date(),
      triggerType: 'manual',
      location: currentLocation,
      status: 'sent',
      guardiansNotified: guardians.filter(g => g.isEmergencyContact).map(g => g.id),
    }]);
  }, [currentLocation, guardians]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const triggerFakeCall = useCallback((config: FakeCallConfig) => {
    setFakeCallConfig(config);
    setTimeout(() => {
      setIsFakeCallActive(true);
    }, config.delay * 1000);
  }, []);

  const endFakeCall = useCallback(() => {
    setIsFakeCallActive(false);
    setFakeCallConfig(null);
  }, []);

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      guardians,
      addGuardian,
      removeGuardian,
      safeZones,
      addSafeZone,
      removeSafeZone,
      toggleSafeZone,
      routineRoutes,
      pastRoutes,
      currentRoute,
      isRecordingRoute,
      startRecordingRoute,
      stopRecordingRoute,
      addRoutePoint,
      saveRoutineRoute,
      sosEvents,
      isSOSActive,
      preSOSCountdown,
      triggerPreSOS,
      cancelSOS,
      confirmSOS,
      settings,
      updateSettings,
      fakeCallConfig,
      triggerFakeCall,
      endFakeCall,
      isFakeCallActive,
      currentLocation,
      setCurrentLocation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// THADAM Safety App Types

export interface Coordinate {
  lat: number;
  lng: number;
  timestamp?: number;
}

export interface RoutineRoute {
  id: string;
  name: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  polylinePoints: Coordinate[];
  typicalDuration: number; // in minutes
  allowedDeviation: number; // in meters
  createdAt: Date;
}

export interface PastRoute {
  id: string;
  date: Date;
  polylinePoints: Coordinate[];
  deviations: Coordinate[];
  duration: number;
  distance: number;
}

export interface SafeZone {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radius: number; // in meters
  isActive: boolean;
}

export interface Guardian {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  isEmergencyContact: boolean;
  avatarColor: string;
}

export interface SOSEvent {
  id: string;
  triggeredAt: Date;
  triggerType: 'manual' | 'fall' | 'immobility' | 'deviation' | 'geofence' | 'pattern';
  location: Coordinate;
  status: 'pending' | 'sent' | 'cancelled' | 'resolved';
  guardiansNotified: string[];
}

export interface DangerDetectionState {
  isMonitoring: boolean;
  lastMotionUpdate: Date | null;
  velocity: number;
  isStationary: boolean;
  fallDetected: boolean;
  jerkDetected: boolean;
}

export interface AppSettings {
  elderMode: boolean;
  stealthMode: boolean;
  stealthAppType: 'calculator' | 'notes';
  autoLearnRoutes: boolean;
  silentSOSEnabled: boolean;
  dangerAIEnabled: boolean;
  sosConfirmationTime: number; // in seconds
}

export type AppScreen = 
  | 'home'
  | 'silent-sos'
  | 'auto-danger'
  | 'geofencing'
  | 'route-tracker'
  | 'guardians'
  | 'fake-call'
  | 'sos-history'
  | 'settings'
  | 'stealth-calculator'
  | 'stealth-notes'
  | 'pre-sos'
  | 'sos-active';

export interface FakeCallConfig {
  callerName: string;
  callerType: 'dad' | 'mom' | 'police' | 'custom';
  delay: number; // in seconds
  customName?: string;
}

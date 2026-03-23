"use client";

import { useApp } from '@/lib/app-context';
import { HomeScreen } from '@/components/screens/home-screen';
import { SilentSOSScreen } from '@/components/screens/silent-sos-screen';
import { AutoDangerScreen } from '@/components/screens/auto-danger-screen';
import { GeofencingScreen } from '@/components/screens/geofencing-screen';
import { RouteTrackerScreen } from '@/components/screens/route-tracker-screen';
import { GuardiansScreen } from '@/components/screens/guardians-screen';
import { FakeCallScreen } from '@/components/screens/fake-call-screen';
import { SettingsScreen } from '@/components/screens/settings-screen';
import { StealthCalculatorScreen } from '@/components/screens/stealth-calculator-screen';
import { StealthNotesScreen } from '@/components/screens/stealth-notes-screen';
import { PreSOSScreen } from '@/components/screens/pre-sos-screen';
import { SOSActiveScreen } from '@/components/screens/sos-active-screen';
import { FakeCallUI } from '@/components/fake-call-ui';
import { BottomNav } from '@/components/bottom-nav';

export function ThadamApp() {
  const { currentScreen, settings, isFakeCallActive } = useApp();

  // Handle stealth mode
  if (settings.stealthMode) {
    if (settings.stealthAppType === 'calculator') {
      return <StealthCalculatorScreen />;
    }
    return <StealthNotesScreen />;
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'silent-sos':
        return <SilentSOSScreen />;
      case 'auto-danger':
        return <AutoDangerScreen />;
      case 'geofencing':
        return <GeofencingScreen />;
      case 'route-tracker':
        return <RouteTrackerScreen />;
      case 'guardians':
        return <GuardiansScreen />;
      case 'fake-call':
        return <FakeCallScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'pre-sos':
        return <PreSOSScreen />;
      case 'sos-active':
        return <SOSActiveScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav = !['pre-sos', 'sos-active'].includes(currentScreen);

  return (
    <div className="relative min-h-screen bg-[#0D021F]">
      {renderScreen()}
      {showBottomNav && <BottomNav />}
      {isFakeCallActive && <FakeCallUI />}
    </div>
  );
}

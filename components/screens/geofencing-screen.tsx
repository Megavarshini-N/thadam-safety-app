"use client";

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { ScreenHeader } from '@/components/screen-header';
import { MapView } from '@/components/map-view';
import type { Coordinate } from '@/lib/types';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Shield,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  X,
  Check
} from 'lucide-react';

const zoneIcons = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'work', icon: Briefcase, label: 'Work' },
  { id: 'school', icon: GraduationCap, label: 'School' },
  { id: 'custom', icon: Heart, label: 'Custom' },
];

export function GeofencingScreen() {
  const { 
    settings, 
    safeZones, 
    addSafeZone, 
    removeSafeZone, 
    toggleSafeZone,
    currentLocation 
  } = useApp();
  
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRadius, setNewZoneRadius] = useState(200);
  const [selectedIcon, setSelectedIcon] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(null);

  const handleMapClick = (coord: Coordinate) => {
    if (isAddingZone) {
      setSelectedLocation(coord);
    }
  };

  const handleSaveZone = () => {
    if (!selectedLocation || !newZoneName) return;
    
    addSafeZone({
      name: newZoneName,
      centerLat: selectedLocation.lat,
      centerLng: selectedLocation.lng,
      radius: newZoneRadius,
      isActive: true,
    });
    
    setIsAddingZone(false);
    setNewZoneName('');
    setNewZoneRadius(200);
    setSelectedLocation(null);
  };

  const handleCancelAdd = () => {
    setIsAddingZone(false);
    setNewZoneName('');
    setNewZoneRadius(200);
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-[#0D021F] relative overflow-hidden">
      <div className="absolute top-60 right-0 w-[300px] h-[300px] bg-[#D3B3FF]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md mx-auto px-4 py-6 pb-24">
        <ScreenHeader title="Geofencing" subtitle="Safe zone boundaries" />

        {/* Status Card */}
        <div className="glass-card rounded-2xl p-4 mb-4 border border-[#D3B3FF]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#D3B3FF]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#D3B3FF]" />
              </div>
              <div>
                <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white`}>
                  {safeZones.filter(z => z.isActive).length} Active Zones
                </h3>
                <p className="text-[#DAD0EE] text-sm">
                  Alerts when you leave these areas
                </p>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>

        {/* Map */}
        <div className="h-64 mb-4 rounded-2xl overflow-hidden border border-[#3D1A5C]">
          <MapView
            currentLocation={currentLocation}
            safeZones={safeZones}
            onMapClick={handleMapClick}
            showCurrentLocation
            selectedLocation={isAddingZone ? selectedLocation : null}
            selectionRadius={newZoneRadius}
          />
        </div>

        {/* Add Zone Form */}
        {isAddingZone ? (
          <div className="glass-card rounded-2xl p-5 mb-4 border border-[#C7A0E8]/50 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Create Safe Zone</h3>
              <button onClick={handleCancelAdd} className="p-2 rounded-lg hover:bg-[#2A1248]">
                <X className="w-5 h-5 text-[#DAD0EE]" />
              </button>
            </div>

            {/* Zone Name */}
            <div className="mb-4">
              <label className="text-[#DAD0EE] text-sm mb-2 block">Zone Name</label>
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="e.g., My Home"
                className="w-full px-4 py-3 rounded-xl bg-[#2A1248] border border-[#3D1A5C] text-white placeholder:text-[#DAD0EE]/50 focus:outline-none focus:border-[#C7A0E8]"
              />
            </div>

            {/* Zone Icon */}
            <div className="mb-4">
              <label className="text-[#DAD0EE] text-sm mb-2 block">Zone Type</label>
              <div className="flex gap-2">
                {zoneIcons.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedIcon(id)}
                    className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      selectedIcon === id 
                        ? 'bg-[#C7A0E8] text-[#0D021F]' 
                        : 'bg-[#2A1248] text-[#DAD0EE]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Radius Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <label className="text-[#DAD0EE]">Radius</label>
                <span className="text-[#C7A0E8]">{newZoneRadius}m</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={newZoneRadius}
                onChange={(e) => setNewZoneRadius(Number(e.target.value))}
                className="w-full h-2 bg-[#2A1248] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C7A0E8]"
              />
            </div>

            {/* Location Status */}
            <div className="mb-4 p-3 rounded-xl bg-[#2A1248] border border-[#3D1A5C]">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${selectedLocation ? 'text-[#C7A0E8]' : 'text-[#DAD0EE]/50'}`} />
                <span className={`text-sm ${selectedLocation ? 'text-white' : 'text-[#DAD0EE]/50'}`}>
                  {selectedLocation 
                    ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                    : 'Tap on map to select location'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveZone}
              disabled={!selectedLocation || !newZoneName}
              className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                selectedLocation && newZoneName 
                  ? 'bg-gradient-to-r from-[#C7A0E8] to-[#B57EDC] text-white' 
                  : 'bg-[#2A1248] text-[#DAD0EE]/50 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              Save Safe Zone
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingZone(true)}
            className="w-full py-4 rounded-2xl glass-card border border-[#C7A0E8]/30 text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#2A1248] transition-colors mb-4"
          >
            <Plus className="w-5 h-5 text-[#C7A0E8]" />
            Add New Safe Zone
          </button>
        )}

        {/* Safe Zones List */}
        <h3 className={`${settings.elderMode ? 'text-xl' : 'text-lg'} font-semibold text-white mb-3`}>
          Your Safe Zones
        </h3>
        
        <div className="space-y-3">
          {safeZones.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 border border-[#3D1A5C] text-center">
              <MapPin className="w-12 h-12 text-[#DAD0EE]/30 mx-auto mb-3" />
              <p className="text-[#DAD0EE]">No safe zones yet</p>
              <p className="text-[#DAD0EE]/60 text-sm mt-1">
                Add zones to get alerts when you leave them
              </p>
            </div>
          ) : (
            safeZones.map((zone) => (
              <div 
                key={zone.id} 
                className={`glass-card rounded-2xl p-4 border transition-all ${
                  zone.isActive ? 'border-[#C7A0E8]/50' : 'border-[#3D1A5C] opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    zone.isActive ? 'bg-[#C7A0E8]/20' : 'bg-[#2A1248]'
                  }`}>
                    <MapPin className={`w-6 h-6 ${zone.isActive ? 'text-[#C7A0E8]' : 'text-[#DAD0EE]/50'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{zone.name}</h4>
                    <p className="text-[#DAD0EE] text-sm">
                      Radius: {zone.radius}m
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSafeZone(zone.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        zone.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-[#2A1248] text-[#DAD0EE]'
                      }`}
                    >
                      {zone.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => removeSafeZone(zone.id)}
                      className="p-2 rounded-lg hover:bg-[#EE44FF]/20 text-[#DAD0EE] hover:text-[#EE44FF] transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

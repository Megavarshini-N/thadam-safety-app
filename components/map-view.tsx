"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Coordinate, SafeZone, RoutineRoute } from "@/lib/types";

interface MapViewProps {
  center?: Coordinate;
  zoom?: number;
  currentLocation?: Coordinate;
  routineRoute?: RoutineRoute | null;
  currentRoute?: Coordinate[];
  deviationPoints?: Coordinate[];
  safeZones?: SafeZone[];
  showCurrentLocation?: boolean;
  onMapClick?: (coord: Coordinate) => void;
  className?: string;
  isRecording?: boolean;
  selectedLocation?: Coordinate | null;
  selectionRadius?: number;
}

// Coimbatore, Tamil Nadu coordinates
const DEFAULT_CENTER = { lat: 11.0261194, lng: 77.0191128 };

export function MapView({
  center = DEFAULT_CENTER,
  zoom = 14,
  currentLocation,
  routineRoute,
  currentRoute = [],
  deviationPoints = [],
  safeZones = [],
  showCurrentLocation = true,
  onMapClick,
  className = "",
  isRecording = false,
  selectedLocation = null,
  selectionRadius = 200,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeLayersRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      // Dynamic import to avoid SSR issues
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      
      leafletRef.current = L.default || L;
      const leaflet = leafletRef.current;

      // Create map instance
      const map = leaflet.map(mapRef.current!, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Default OpenStreetMap tiles
      leaflet.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      // Add zoom control to bottom right
      leaflet.control.zoom({ position: "bottomright" }).addTo(map);

      // Create layer groups for markers and routes
      markersRef.current = leaflet.layerGroup().addTo(map);
      routeLayersRef.current = leaflet.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom]);

  // Handle map click events - separate effect so it updates when onMapClick changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    };
    
    map.on("click", handleClick);
    
    return () => {
      map.off("click", handleClick);
    };
  }, [onMapClick]);

  // Update markers and routes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !leafletRef.current) return;

    const updateMapLayers = () => {
      const map = mapInstanceRef.current!;
      const L = leafletRef.current;

      // Clear existing layers
      markersRef.current?.clearLayers();
      routeLayersRef.current?.clearLayers();

      // Custom marker icons
      const createPulsingIcon = (color: string, size: number = 20) => {
        return L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background: ${color};
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              animation: pulse-marker 2s ease-in-out infinite;
            "></div>
            <style>
              @keyframes pulse-marker {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
              }
            </style>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      };

      // Draw safe zones
      safeZones.forEach((zone) => {
        if (!zone.isActive) return;

        const circle = L.circle([zone.centerLat, zone.centerLng], {
          radius: zone.radius,
          color: "#7C3AED",
          fillColor: "#7C3AED",
          fillOpacity: 0.2,
          weight: 3,
        });

        routeLayersRef.current?.addLayer(circle);

        // Add zone label
        const label = L.marker([zone.centerLat, zone.centerLng], {
          icon: L.divIcon({
            className: "zone-label",
            html: `<div style="
              background: white;
              color: #7C3AED;
              padding: 4px 8px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 600;
              border: 2px solid #7C3AED;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              white-space: nowrap;
            ">${zone.name}</div>`,
            iconAnchor: [0, 0],
          }),
        });
        markersRef.current?.addLayer(label);
      });

      // Draw routine route
      if (routineRoute && routineRoute.polylinePoints.length > 1) {
        const routeCoords = routineRoute.polylinePoints.map(
          (p) => [p.lat, p.lng] as [number, number]
        );

        const routeLine = L.polyline(routeCoords, {
          color: "#7C3AED",
          weight: 5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        });

        // Add shadow line for depth
        const glowLine = L.polyline(routeCoords, {
          color: "#7C3AED",
          weight: 10,
          opacity: 0.3,
          lineCap: "round",
          lineJoin: "round",
        });

        routeLayersRef.current?.addLayer(glowLine);
        routeLayersRef.current?.addLayer(routeLine);

        // Start marker
        const startMarker = L.marker(routeCoords[0], {
          icon: L.divIcon({
            className: "route-marker",
            html: `<div style="
              width: 16px;
              height: 16px;
              background: #22C55E;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 0 15px #22C55E;
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        });

        // End marker
        const endMarker = L.marker(routeCoords[routeCoords.length - 1], {
          icon: L.divIcon({
            className: "route-marker",
            html: `<div style="
              width: 16px;
              height: 16px;
              background: #EF4444;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 0 15px #EF4444;
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        });

        markersRef.current?.addLayer(startMarker);
        markersRef.current?.addLayer(endMarker);
      }

      // Draw current route (live tracking)
      if (currentRoute.length > 1) {
        const currentCoords = currentRoute.map(
          (p) => [p.lat, p.lng] as [number, number]
        );

        const glowLine = L.polyline(currentCoords, {
          color: "#3B82F6",
          weight: 12,
          opacity: 0.3,
          lineCap: "round",
          lineJoin: "round",
        });

        const currentLine = L.polyline(currentCoords, {
          color: "#3B82F6",
          weight: 5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        });

        routeLayersRef.current?.addLayer(glowLine);
        routeLayersRef.current?.addLayer(currentLine);

        // Breadcrumb markers every 5 points
        currentRoute.forEach((point, i) => {
          if (i % 5 === 0 && i > 0 && i < currentRoute.length - 1) {
            const breadcrumb = L.circleMarker([point.lat, point.lng], {
              radius: 4,
              color: "#3B82F6",
              fillColor: "#3B82F6",
              fillOpacity: 1,
              weight: 0,
            });
            markersRef.current?.addLayer(breadcrumb);
          }
        });
      }

      // Draw deviation points (danger)
      if (deviationPoints.length > 1) {
        const deviationCoords = deviationPoints.map(
          (p) => [p.lat, p.lng] as [number, number]
        );

        const glowLine = L.polyline(deviationCoords, {
          color: "#EF4444",
          weight: 12,
          opacity: 0.3,
          lineCap: "round",
          lineJoin: "round",
        });

        const deviationLine = L.polyline(deviationCoords, {
          color: "#EF4444",
          weight: 5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
          dashArray: "10, 10",
        });

        routeLayersRef.current?.addLayer(glowLine);
        routeLayersRef.current?.addLayer(deviationLine);
      }

      // Draw current location marker
      if (showCurrentLocation && currentLocation) {
        const locationMarker = L.marker([currentLocation.lat, currentLocation.lng], {
          icon: createPulsingIcon("#3B82F6", 24),
        });

        // Add accuracy circle
        const accuracyCircle = L.circle([currentLocation.lat, currentLocation.lng], {
          radius: 50,
          color: "#3B82F6",
          fillColor: "#3B82F6",
          fillOpacity: 0.15,
          weight: 2,
        });

        markersRef.current?.addLayer(accuracyCircle);
        markersRef.current?.addLayer(locationMarker);
      }

      // Draw selected location marker (for adding new zones)
      if (selectedLocation) {
        // Selection marker
        const selectionMarker = L.marker([selectedLocation.lat, selectedLocation.lng], {
          icon: L.divIcon({
            className: "selection-marker",
            html: `
              <div style="
                width: 32px;
                height: 32px;
                background: #EF4444;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 10px;
                  height: 10px;
                  background: white;
                  border-radius: 50%;
                  transform: rotate(45deg);
                "></div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        });

        // Selection radius circle
        const selectionCircle = L.circle([selectedLocation.lat, selectedLocation.lng], {
          radius: selectionRadius,
          color: "#EF4444",
          fillColor: "#EF4444",
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "8, 8",
        });

        routeLayersRef.current?.addLayer(selectionCircle);
        markersRef.current?.addLayer(selectionMarker);

        // Pan to selected location
        map.panTo([selectedLocation.lat, selectedLocation.lng]);
      }
    };

    updateMapLayers();
  }, [
    isMapReady,
    currentLocation,
    routineRoute,
    currentRoute,
    deviationPoints,
    safeZones,
    showCurrentLocation,
    selectedLocation,
    selectionRadius,
  ]);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl ${className}`}>
      <div ref={mapRef} className="w-full h-full" style={{ background: "#f5f5f5" }} />

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full border border-red-200 shadow-md">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-red-600">REC</span>
        </div>
      )}

      {/* Location badge */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-md">
        <p className="text-xs text-gray-700 font-medium">Coimbatore, Tamil Nadu</p>
      </div>

      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

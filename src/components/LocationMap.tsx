'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

const DEFAULT_CENTER = { lat: 51.2097, lng: 6.7825 };

type LocationMapProps = {
  apiKey: string;
  className?: string;
  height?: number;
  address?: string | null;
  center?: { lat: number; lng: number };
  zoom?: number;
};

async function geocodeAddress(address: string, apiKey: string): Promise<{ lat: number; lng: number } | null> {
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await res.json();
    const loc = data.results?.[0]?.geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  } catch {
    return null;
  }
}

export default function LocationMap({
  apiKey,
  className = '',
  height = 200,
  address,
  center,
  zoom = 15,
}: LocationMapProps) {
  const [mapCenter, setMapCenter] = useState(center ?? DEFAULT_CENTER);

  useEffect(() => {
    if (address?.trim() && apiKey) {
      geocodeAddress(address, apiKey).then((coords) => {
        if (coords) setMapCenter(coords);
      });
    } else if (center) {
      setMapCenter(center);
    } else {
      setMapCenter(DEFAULT_CENTER);
    }
  }, [address, center, apiKey]);

  if (!apiKey) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-500 text-sm`} style={{ height: `${height}px` }}>
        Map unavailable (configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      </div>
    );
  }

  return (
    <div className={className}>
      <APIProvider apiKey={apiKey}>
        <Map
          key={`${mapCenter.lat}-${mapCenter.lng}`}
          style={{ width: '100%', height: `${height}px` }}
          defaultZoom={zoom}
          defaultCenter={mapCenter}
          gestureHandling="greedy"
          disableDefaultUI
        />
      </APIProvider>
    </div>
  );
}

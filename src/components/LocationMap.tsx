'use client';

import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const DEFAULT_CENTER = { lat: 51.2097, lng: 6.7825 };

type LocationMapProps = {
  className?: string;
  height?: number;
  address?: string | null;
  center?: { lat: number; lng: number };
  zoom?: number;
};

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await res.json();
    const loc = data.results?.[0]?.geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  } catch {
    return null;
  }
}

export default function LocationMap({
  className = '',
  height = 200,
  address,
  center,
  zoom = 15,
}: LocationMapProps) {
  const [mapCenter, setMapCenter] = useState(center ?? DEFAULT_CENTER);

  useEffect(() => {
    if (address?.trim()) {
      geocodeAddress(address).then((coords) => {
        if (coords) setMapCenter(coords);
      });
    } else if (center) {
      setMapCenter(center);
    } else {
      setMapCenter(DEFAULT_CENTER);
    }
  }, [address, center]);

  return (
    <div className={className}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
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

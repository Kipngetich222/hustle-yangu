// hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  enabled?: boolean;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    enabled = true
  } = options;

  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);

    const onSuccess = (pos: GeolocationPosition) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      });
      setError(null);
      setIsLoading(false);
    };

    const onError = (err: GeolocationError) => {
      let errorMessage = 'Unable to retrieve your location';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location services.';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case err.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    // Watch position for updates
    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled, enableHighAccuracy, timeout, maximumAge]);

  const getDistance = (lat2: number, lon2: number): number => {
    if (!position) return 0;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - position.latitude);
    const dLon = toRad(lon2 - position.longitude);
    const lat1 = toRad(position.latitude);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  const getAddress = async (): Promise<string> => {
    if (!position) return '';

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const { road, suburb, city, state, country } = data.address;
        return [road, suburb, city, state, country].filter(Boolean).join(', ');
      }
      return '';
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  const requestPermission = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.permissions || !navigator.permissions.query) {
        resolve(true); // Assume granted if API not available
        return;
      }

      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'granted') {
            resolve(true);
          } else if (result.state === 'prompt') {
            // Request permission through getCurrentPosition
            navigator.geolocation.getCurrentPosition(
              () => resolve(true),
              () => resolve(false),
              { enableHighAccuracy, timeout, maximumAge }
            );
          } else {
            resolve(false);
          }
        })
        .catch(() => resolve(false));
    });
  };

  return {
    position,
    error,
    isLoading,
    getDistance,
    getAddress,
    requestPermission
  };
}
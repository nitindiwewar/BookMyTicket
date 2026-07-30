/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { STORAGE_KEYS } from "../constants/index.js";

const LocationContext = createContext(null);
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAEeb2ervheFgG-c1ipDU0mKuKvEqxj8QY";

function guessCity() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (tz.includes("Kolkata")) return "Kolkata";
  return "Mumbai";
}

function loadGoogleMapsSdk() {
  if (window.google?.maps) return Promise.resolve();
  if (window._googleMapsLoadingPromise) return window._googleMapsLoadingPromise;

  window._googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return window._googleMapsLoadingPromise;
}

function extractExactLocationFromGoogleMaps(results) {
  if (!results || !results[0]) return null;
  const components = results[0].address_components;
  let neighborhood = "";
  let sublocality = "";
  let locality = "";
  let adminArea = "";

  for (const comp of components) {
    if (comp.types.includes("sublocality_level_1") || comp.types.includes("sublocality")) {
      sublocality = comp.long_name;
    } else if (comp.types.includes("neighborhood")) {
      neighborhood = comp.long_name;
    } else if (comp.types.includes("locality")) {
      locality = comp.long_name;
    } else if (comp.types.includes("administrative_area_level_2")) {
      if (!locality) locality = comp.long_name;
    } else if (comp.types.includes("administrative_area_level_1")) {
      adminArea = comp.long_name;
    }
  }

  const sub = sublocality || neighborhood;
  const city = locality || adminArea;

  if (sub && city && sub.toLowerCase() !== city.toLowerCase()) {
    return `${sub}, ${city}`;
  }
  return city || sub || results[0].formatted_address.split(",")[0];
}

async function reverseGeocodeGps(lat, lng) {
  try {
    await loadGoogleMapsSdk();
    if (window.google?.maps?.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      const res = await new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            resolve(extractExactLocationFromGoogleMaps(results));
          } else {
            resolve(null);
          }
        });
      });
      if (res) return res;
    }
  } catch (err) {
    console.warn("Google Maps Geocoder failed, using fallback:", err);
  }

  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const sub = data.locality || data.localityInfo?.informative?.[0]?.name;
      const city = data.city || data.principalSubdivision;
      if (sub && city && sub.toLowerCase() !== city.toLowerCase()) {
        return `${sub}, ${city}`;
      }
      return city || sub;
    }
  } catch (e) {
    console.warn("GPS Reverse Geocode fetch error:", e);
  }

  return null;
}

export function LocationProvider({ children }) {
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
    return saved || "Mumbai";
  });
  const [status, setStatus] = useState("idle");
  const watchIdRef = useRef(null);
  const lastCityRef = useRef(city);
  const lastUpdateTsRef = useRef(Date.now());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOCATION, city);
  }, [city]);

  useEffect(() => {
    lastCityRef.current = city;
  }, [city]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null && navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
    };
  }, []);

  const api = useMemo(() => {
    const THROTTLE_MS = 15_000;

    const updateFromCoords = async (coords) => {
      const now = Date.now();
      if (now - lastUpdateTsRef.current < THROTTLE_MS) return;

      const gpsCity = await reverseGeocodeGps(coords.latitude, coords.longitude);
      if (gpsCity && gpsCity !== lastCityRef.current) {
        lastUpdateTsRef.current = now;
        lastCityRef.current = gpsCity;
        localStorage.setItem(STORAGE_KEYS.LOCATION, gpsCity);
        setCity(gpsCity);
      }
    };

    const stopRealTime = () => {
      if (watchIdRef.current != null && navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
      setStatus("idle");
    };

    const startRealTime = () => {
      if (!navigator.geolocation) {
        setCity(guessCity());
        setStatus("idle");
        return;
      }

      if (watchIdRef.current != null) return;
      setStatus("watching");

      try {
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            updateFromCoords(pos.coords);
          },
          (error) => {
            setStatus(error?.code === 1 ? "denied" : "idle");
            stopRealTime();
          },
          {
            enableHighAccuracy: true,
            timeout: 10_000,
            maximumAge: 30_000,
          }
        );
        watchIdRef.current = id;
      } catch {
        setStatus("idle");
      }
    };

    const handleSetCity = (newCity) => {
      if (!newCity) return;
      lastCityRef.current = newCity;
      lastUpdateTsRef.current = Date.now();
      localStorage.setItem(STORAGE_KEYS.LOCATION, newCity);
      setCity(newCity);
    };

    return {
      city,
      status,
      setCity: handleSetCity,
      async detect() {
        setStatus("detecting");
        if (!navigator.geolocation) {
          handleSetCity(guessCity());
          setStatus("idle");
          return;
        }

        const getPos = () =>
          new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            })
          );

        try {
          const { coords } = await getPos();
          const realGpsCity = await reverseGeocodeGps(coords.latitude, coords.longitude);
          if (realGpsCity) {
            handleSetCity(realGpsCity);
          } else {
            handleSetCity(guessCity());
          }
          setStatus("idle");
        } catch (error) {
          handleSetCity(guessCity());
          setStatus(error?.code === 1 ? "denied" : "idle");
          if (error?.code === 1) {
            setTimeout(() => setStatus("idle"), 1500);
          }
        }
      },
      startRealTime,
      stopRealTime,
      isWatching: () => watchIdRef.current != null,
    };
  }, [city, status]);

  useEffect(() => {
    if (navigator.geolocation) {
      api.detect();
    }
  }, []);

  return (
    <LocationContext.Provider value={api}>{children}</LocationContext.Provider>
  );
}

export function useLocationCity() {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error("useLocationCity must be used within LocationProvider");
  return ctx;
}

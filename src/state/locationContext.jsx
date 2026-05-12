/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  STORAGE_KEYS,
  CITY_OPTIONS,
  CITY_COORDINATES,
} from "../constants/index.js";

const LocationContext = createContext(null);

function guessCity() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (tz.includes("Kolkata")) return "Kolkata";
  const lang = (navigator.language || "").toLowerCase();
  if (lang.includes("en-in") || lang.includes("hi")) return "Mumbai";
  return "Bengaluru";
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function getNearestCity(lat, lon) {
  let bestCity = CITY_OPTIONS[0];
  let bestDistance = Infinity;

  for (const city of CITY_OPTIONS) {
    const coords = CITY_COORDINATES[city];
    if (!coords) continue;
    const [cityLat, cityLon] = coords;
    const dist = distance(lat, lon, cityLat, cityLon);
    if (dist < bestDistance) {
      bestCity = city;
      bestDistance = dist;
    }
  }

  return bestCity;
}

export function LocationProvider({ children }) {
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
    return saved || guessCity();
  });
  const [status, setStatus] = useState("idle"); // idle | detecting | watching | denied
  const watchIdRef = useRef(null);
  const lastCityRef = useRef(city);
  const lastUpdateTsRef = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOCATION, city);
  }, [city]);

  useEffect(() => {
    // Keep refs in sync
    lastCityRef.current = city;
  }, [city]);

  useEffect(() => {
    return () => {
      // Cleanup any live watcher on unmount
      if (watchIdRef.current != null && navigator.geolocation?.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
    };
  }, []);

  const api = useMemo(() => {
    const THROTTLE_MS = 15_000;

    const updateFromCoords = (coords) => {
      const nearestCity = getNearestCity(coords.latitude, coords.longitude);
      const now = Date.now();

      // Throttle + only update on city changes
      if (
        nearestCity !== lastCityRef.current &&
        now - lastUpdateTsRef.current >= THROTTLE_MS
      ) {
        lastUpdateTsRef.current = now;
        lastCityRef.current = nearestCity;
        setCity(nearestCity);
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

      // Avoid multiple watchers
      if (watchIdRef.current != null) return;

      setStatus("watching");

      try {
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const { coords } = pos;
            updateFromCoords(coords);
          },
          (error) => {
            const guessed = guessCity();
            setCity(guessed);
            setStatus(error?.code === 1 ? "denied" : "idle");

            // Stop watcher on hard failures (except intermittent errors)
            stopRealTime();

            if (error?.code === 1) {
              setTimeout(() => setStatus("idle"), 1500);
            }
          },
          {
            enableHighAccuracy: false,
            // tighter values than the one-time detect to feel "real-time"
            timeout: 8_000,
            maximumAge: 30_000,
          },
        );
        watchIdRef.current = id;
      } catch {
        // If watchPosition throws synchronously
        setCity(guessCity());
        setStatus("idle");
      }
    };

    return {
      city,
      status,
      options: CITY_OPTIONS,
      setCity,
      async detect() {
        // one-time detection
        setStatus("detecting");
        if (!navigator.geolocation) {
          setCity(guessCity());
          setStatus("idle");
          return;
        }

        const getPos = () =>
          new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 6000,
              maximumAge: 60_000,
            }),
          );

        try {
          const { coords } = await getPos();
          const nearestCity = getNearestCity(coords.latitude, coords.longitude);
          setCity(nearestCity);
          setStatus("idle");
        } catch (error) {
          const guessed = guessCity();
          setCity(guessed);
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

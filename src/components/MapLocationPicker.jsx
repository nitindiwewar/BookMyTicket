import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./ui/Card.jsx";

import { useLocationCity } from "../state/locationContext.jsx";

function loadGoogleMaps(apiKey) {
  if (!apiKey) return Promise.reject(new Error("Missing Google Maps API key"));

  // If already loaded, resolve.
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  // Reuse in-flight request.
  const existing = window.__gmapsPromise;
  if (existing) return existing;

  window.__gmapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-gmaps="1"]');
    if (existingScript) {
      // If a script exists but maps isn't ready yet, wait for it.
      existingScript.addEventListener("load", () => {
        resolve(window.google?.maps);
      });
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.dataset.gmaps = "1";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&libraries=marker&v=weekly`;

    script.onload = () => resolve(window.google?.maps);
    script.onerror = reject;

    document.head.appendChild(script);
  });

  return window.__gmapsPromise;
}

export default function MapLocationPicker({ onDone, onCancel }) {
  const loc = useLocationCity();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [mapsReady, setMapsReady] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const initialCenter = useMemo(() => {
    // Start map near default city; user will drag marker anyway.
    return { lat: 19.076, lng: 72.8777 }; // Mumbai
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setError("");
        await loadGoogleMaps(apiKey);
        if (cancelled) return;

        setMapsReady(true);

        const maps = window.google.maps;
        const map = new maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        markerRef.current = new maps.Marker({
          position: initialCenter,
          map,
          draggable: true,
        });

        // No UI here; conversion happens on Done.
      } catch (e) {
        if (cancelled) return;
        setError(
          e?.message ||
            "Unable to load Google Maps. Add VITE_GOOGLE_MAPS_API_KEY and refresh.",
        );
      }
    }

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const [markerReady, setMarkerReady] = useState(false);

  useEffect(() => {
    // Marker readiness is derived from ref creation in init().
    setMarkerReady(Boolean(markerRef.current));
  }, []);

  const handleDone = () => {
    if (!markerRef.current) return;
    const pos = markerRef.current.getPosition();
    if (!pos) return;

    const lat = pos.lat();
    const lng = pos.lng();

    // Reuse nearest-city logic by calling detect() then overriding city based on lat/lng
    // But detect() uses live device coords; instead we compute city via a lightweight copy:
    // We'll replicate CITY_COORDINATES/dist logic by leveraging locationContext's nearest city indirectly.
    // Easiest: call a local approximation by using the existing API approach via dynamic import.

    // Instead of duplicating math here, call the context's start/stop? Not ideal.
    // We'll approximate by setting a temporary city based on nearest to known city coords,
    // by importing from constants.

    import("../constants/index.js").then((mod) => {
      const { CITY_OPTIONS, CITY_COORDINATES } = mod;

      const toRadians = (value) => (value * Math.PI) / 180;
      const distance = (lat1, lon1, lat2, lon2) => {
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
      };

      let bestCity = CITY_OPTIONS[0];
      let bestDistance = Infinity;
      for (const city of CITY_OPTIONS) {
        const coords = CITY_COORDINATES[city];
        if (!coords) continue;
        const [cityLat, cityLng] = coords;
        const dist = distance(lat, lng, cityLat, cityLng);
        if (dist < bestDistance) {
          bestCity = city;
          bestDistance = dist;
        }
      }

      loc.setCity(bestCity);
      onDone?.();
    });
  };

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-xs font-semibold text-white/70">
          Map unavailable
        </div>
        <div className="mt-2 text-xs text-white/50">{error}</div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold text-white/70">Pick on map</div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
        >
          Cancel
        </button>
      </div>

      <div className="mt-3">
        <div
          ref={mapRef}
          className="h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        />

        {!mapsReady ? (
          <div className="-mt-64 flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 text-xs text-white/50">
            Loading map…
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleDone}
          disabled={!markerReady}
          className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
        >
          Done
        </button>
      </div>
    </Card>
  );
}

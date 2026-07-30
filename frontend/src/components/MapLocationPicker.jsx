import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import { useLocationCity } from "../state/locationContext.jsx";
import { MapPin, Search, Navigation } from "lucide-react";

function loadGoogleMaps(apiKey) {
  if (!apiKey) return Promise.reject(new Error("Missing Google Maps API key"));

  if (window.google?.maps) return Promise.resolve(window.google.maps);

  const existing = window.__gmapsPromise;
  if (existing) return existing;

  window.__gmapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-gmaps="1"]');
    if (existingScript) {
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
      apiKey
    )}&libraries=places&v=weekly`;

    script.onload = () => resolve(window.google?.maps);
    script.onerror = reject;

    document.head.appendChild(script);
  });

  return window.__gmapsPromise;
}

export default function MapLocationPicker({ onDone, onCancel }) {
  const loc = useLocationCity();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [mapsReady, setMapsReady] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("Click or drag marker on map");
  const [cityName, setCityName] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAEeb2ervheFgG-c1ipDU0mKuKvEqxj8QY";

  const initialCenter = useMemo(() => {
    return { lat: 19.076, lng: 72.8777 }; // Default Map Center (Mumbai)
  }, []);

  const reverseGeocode = (lat, lng) => {
    if (!window.google?.maps?.Geocoder) return;
    setGeocoding(true);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setGeocoding(false);
      if (status === "OK" && results && results[0]) {
        const item = results[0];
        setSelectedAddress(item.formatted_address);

        // Extract city from address_components
        let foundCity = "";
        for (const comp of item.address_components) {
          if (comp.types.includes("locality")) {
            foundCity = comp.long_name;
            break;
          } else if (comp.types.includes("administrative_area_level_2")) {
            foundCity = comp.long_name;
          } else if (!foundCity && comp.types.includes("administrative_area_level_1")) {
            foundCity = comp.long_name;
          }
        }
        if (!foundCity) {
          foundCity = item.formatted_address.split(",")[0];
        }
        setCityName(foundCity);
      }
    });
  };

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
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        mapInstanceRef.current = map;

        const marker = new maps.Marker({
          position: initialCenter,
          map,
          draggable: true,
          animation: maps.Animation.DROP,
        });
        markerRef.current = marker;

        // Perform initial reverse geocoding
        reverseGeocode(initialCenter.lat, initialCenter.lng);

        // Listen for marker dragend
        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (pos) {
            reverseGeocode(pos.lat(), pos.lng());
          }
        });

        // Listen for map click to reposition marker
        map.addListener("click", (e) => {
          if (e.latLng) {
            marker.setPosition(e.latLng);
            reverseGeocode(e.latLng.lat(), e.latLng.lng());
          }
        });
      } catch (e) {
        if (cancelled) return;
        setError(
          e?.message ||
            "Unable to load Google Maps. Check your internet connection or API Key."
        );
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [apiKey, initialCenter]);

  const handleSearchAddress = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !window.google?.maps?.Geocoder) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(14);
          markerRef.current.setPosition(location);
          reverseGeocode(location.lat(), location.lng());
        }
      }
    });
  };

  const handleConfirmLocation = () => {
    const finalCity = cityName || selectedAddress.split(",")[0] || "Custom Location";
    if (loc?.setCity) {
      loc.setCity(finalCity);
    }
    onDone?.();
  };

  if (error) {
    return (
      <Card className="p-5 bg-white space-y-3 rounded-2xl border border-slate-200">
        <div className="text-xs font-bold text-slate-800">Map Mode Unavailable</div>
        <div className="text-xs text-slate-500">{error}</div>
        <Button size="sm" variant="subtle" onClick={onCancel}>
          Back to Selection
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-5 bg-white space-y-3.5 rounded-[24px] border border-slate-200 shadow-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#FF1744] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Google Maps Location Picker
          </div>
          <div className="text-[11px] text-[#6B7280] font-semibold mt-0.5">
            Drag marker or click anywhere on map to set your location
          </div>
        </div>
        <Button size="xs" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Map Search Bar */}
      <form onSubmit={handleSearchAddress} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location, locality, or address on map..."
          className="w-full rounded-full bg-slate-100 pl-9 pr-20 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none border border-slate-200 focus:bg-white focus:border-[#FF1744]"
        />
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <button
          type="submit"
          className="absolute right-1.5 top-1 rounded-full bg-[#FF1744] px-3 py-1 text-[10px] font-extrabold text-white hover:bg-red-600 transition"
        >
          Search
        </button>
      </form>

      {/* Interactive Map View */}
      <div className="relative">
        <div
          ref={mapRef}
          className="h-64 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
        />

        {!mapsReady && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-100 text-xs font-bold text-slate-500">
            Loading Google Maps...
          </div>
        )}
      </div>

      {/* Real-time Reverse Geocoded Address Box */}
      <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-extrabold uppercase text-[#FF1744] tracking-wider">Selected Location</div>
          <div className="text-xs font-extrabold text-slate-900 truncate">
            {geocoding ? "Detecting address..." : (cityName || "Custom Map Location")}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold truncate">
            {selectedAddress}
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleConfirmLocation}
          disabled={!mapsReady || geocoding}
        >
          Confirm Location
        </Button>
      </div>
    </Card>
  );
}

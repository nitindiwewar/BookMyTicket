import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Search, MapPin, Sparkles, Clock, ArrowRight, Heart, Info, Navigation, Compass, Filter } from "lucide-react";
import BookingStepper from "../components/BookingStepper.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { getMovieById } from "../api/movieApi.js";
import { getTheaters, getShows } from "../api/theaterApi.js";
import { useBooking } from "../state/bookingContext.jsx";
import { useLocationCity } from "../state/locationContext.jsx";
import { useToast } from "../state/toastContext.jsx";
import { formatDuration } from "../utils/formatters.js";

const THEATER_GPS = {
  // Hyderabad
  "AMB Cinemas Superplex": { lat: 17.4435, lng: 78.3654 },
  "MovieMax Luxe Multiplex": { lat: 17.4156, lng: 78.4347 },
  "PVR Forum Sujana Mall": { lat: 17.4842, lng: 78.3889 },
  "PVR Forum Sujana Multiplex": { lat: 17.4842, lng: 78.3889 },
  "INOX GVK One Mall": { lat: 17.4190, lng: 78.4487 },
  "Cinepolis Manjeera Mall": { lat: 17.4889, lng: 78.3892 },
  // Mumbai
  "PVR INOX Phoenix Palladium": { lat: 18.9953, lng: 72.8258 },
  "PVR INOX Palladium IMAX": { lat: 18.9953, lng: 72.8258 },
  "INOX Insignia BKC": { lat: 19.0660, lng: 72.8691 },
  "Cinepolis Viviana Mall": { lat: 19.2085, lng: 72.9712 },
  "MovieMax Sion": { lat: 19.0350, lng: 72.8600 },
  // Bengaluru
  "PVR Orion Mall IMAX": { lat: 13.0112, lng: 77.5550 },
  "Cinepolis VIP Luxe Cinema": { lat: 12.9901, lng: 77.5524 },
  "Cinepolis Forum Shantiniketan": { lat: 12.9892, lng: 77.7281 },
  "INOX Lido Mall": { lat: 12.9734, lng: 77.6200 },
  // Delhi NCR
  "PVR Director's Cut": { lat: 28.5404, lng: 77.1557 },
  "INOX Laserplex": { lat: 28.5494, lng: 77.2528 },
  "INOX Laser Plex": { lat: 28.5494, lng: 77.2528 },
  "Cinepolis DLF Avenue": { lat: 28.5283, lng: 77.2185 },
  // Kolkata
  "INOX Quest Mall Superplex": { lat: 22.5398, lng: 88.3654 },
  "PVR Mani Square": { lat: 22.5768, lng: 88.3980 },
  // Chennai
  "SPI Sathanam Luxe Cinema": { lat: 13.0573, lng: 80.2608 },
  "PVR VR Chennai": { lat: 13.0850, lng: 80.1917 },
  // Pune
  "Cinepolis Seasons Mall": { lat: 18.5196, lng: 73.9314 },
  "PVR Marketcity": { lat: 18.5622, lng: 73.9167 },
  // Nagpur
  "INOX Jaswant Tuli Mall": { lat: 21.1738, lng: 79.0984 },
  "PVR Empress City Mall": { lat: 21.1444, lng: 79.0906 },
  "Cinepolis VR Mall": { lat: 21.1278, lng: 79.0950 },
  "MovieMax Eternity Mall": { lat: 21.1432, lng: 79.0815 },
};

function getCityTokens(rawLoc) {
  if (!rawLoc) return [];
  return rawLoc.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);
}

function calculateDistanceKm(userLat, userLng, tLat, tLng) {
  if (!userLat || !userLng || !tLat || !tLng) return null;
  const R = 6371;
  const dLat = ((tLat - userLat) * Math.PI) / 180;
  const dLng = ((tLng - userLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((tLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function formatTime(time) {
  if (!time) return "";
  const [hh, mm] = time.split(":");
  const h = Number(hh);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${String(h12).padStart(2, "0")}:${mm} ${suffix}`;
}

function getBookMyShowDates() {
  const dates = [];
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayStr = days[d.getDay()];
    const dateNum = String(d.getDate()).padStart(2, "0");
    const monthStr = months[d.getMonth()];
    const isoDate = d.toISOString().slice(0, 10);
    dates.push({ day: dayStr, date: dateNum, month: monthStr, iso: isoDate });
  }
  return dates;
}

export default function Theaters() {
  const { id } = useParams();
  const booking = useBooking();
  const navigate = useNavigate();
  const loc = useLocationCity();
  const { showToast, showAlert } = useToast();

  const [movie, setMovie] = useState(null);
  const [theatersList, setTheatersList] = useState([]);
  const [showsList, setShowsList] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [sortByNearest, setSortByNearest] = useState(false);
  const [geoStatus, setGeoStatus] = useState("idle");

  const dateList = useMemo(() => getBookMyShowDates(), []);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayStr);

  useEffect(() => {
    if (id) {
      getMovieById(id).then((data) => { if (data) setMovie(data); }).catch(() => {});
      getShows(id, selectedDate).then((data) => { if (Array.isArray(data)) setShowsList(data); }).catch(() => {});
    }
    getTheaters(loc.city).then((data) => { if (Array.isArray(data)) setTheatersList(data); }).catch(() => {});
  }, [id, selectedDate, loc.city]);

  const handleFetchGpsLocation = () => {
    if (!navigator.geolocation) {
      showAlert({
        title: "Geolocation Unavailable",
        message: "Geolocation is not supported by your browser.",
        type: "warning",
      });
      return;
    }
    setGeoStatus("detecting");
    showToast("Detecting your nearest theaters via GPS...", "info", 3000, "Locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortByNearest(true);
        setGeoStatus("done");
        showToast("Theaters sorted by nearest GPS distance!", "success", 3500, "Location Found");
      },
      (err) => {
        console.warn("GPS error:", err);
        setGeoStatus("error");
        showAlert({
          title: "Location Permission Needed",
          message: "Unable to retrieve your GPS location. Please allow browser location permissions to find nearby theaters.",
          type: "error",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const activeTokens = getCityTokens(loc.city);
    
    const byTheater = new Map();
    for (const s of showsList) {
      const tId = s.theater?.id || s.theaterId;
      if (!tId) continue;
      const arr = byTheater.get(tId) || [];
      arr.push(s);
      byTheater.set(tId, arr);
    }

    let filteredTheaters = theatersList.filter((t) => {
      if (activeTokens.length > 0) {
        const tCity = (t.city || "").toLowerCase();
        const tArea = (t.area || "").toLowerCase();
        const tName = (t.name || "").toLowerCase();

        const matchesLocation = activeTokens.some(
          (token) =>
            tCity.includes(token) ||
            token.includes(tCity) ||
            tArea.includes(token) ||
            tName.includes(token)
        );
        if (!matchesLocation) return false;
      }

      if (!needle) return true;
      return `${t.name} ${t.area} ${t.city}`.toLowerCase().includes(needle);
    });

    if (filteredTheaters.length === 0 && activeTokens.some((t) => t.includes("nagpur"))) {
      filteredTheaters = [
        { id: "nag-1", name: "INOX Jaswant Tuli Mall", area: "Kamptee Road, Nagpur", city: "Nagpur", facilities: ["RGB Laser", "Dolby Atmos 7.1", "Plush Seating"] },
        { id: "nag-2", name: "PVR Empress City Mall", area: "Empress City, Near Station, Nagpur", city: "Nagpur", facilities: ["P(XL) Large Screen", "Recliners", "Food Court"] },
        { id: "nag-3", name: "Cinepolis VR Mall", area: "Medical Square, Great Nag Road, Nagpur", city: "Nagpur", facilities: ["VIP Lounge", "Dolby Atmos"] },
        { id: "nag-4", name: "MovieMax Eternity Mall", area: "Variety Square, Sitabuldi, Nagpur", city: "Nagpur", facilities: ["4DX Motion", "Gourmet Kitchen"] },
        { id: "nag-5", name: "Alankar Talkies", area: "Dharampeth, Nagpur", city: "Nagpur", facilities: ["2K Digital", "Dolby Sound"] },
        { id: "nag-6", name: "Liberty Cinema", area: "Sadar, Nagpur", city: "Nagpur", facilities: ["Heritage Cinema", "Dolby 7.1"] },
      ];
    }

    let mapped = filteredTheaters.map((t) => {
      const lat = t.latitude || (THEATER_GPS[t.name]?.lat) || 21.1458;
      const lng = t.longitude || (THEATER_GPS[t.name]?.lng) || 79.0882;
      const dist = userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, lat, lng) : null;
      return {
        theater: t,
        distanceKm: dist,
        showList: (byTheater.get(t.id) || []).sort((a, b) =>
          (a.time || "").localeCompare(b.time || "")
        ),
      };
    });

    if (sortByNearest && userCoords) {
      mapped = mapped.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return mapped;
  }, [showsList, theatersList, query, loc.city, userCoords, sortByNearest]);

  const handleSelectShow = (theater, show) => {
    const activeMovie = movie || booking.state.movie || { id: id || "m1", title: "Movie" };
    booking.setMovie(activeMovie);
    booking.setTheater(theater);
    booking.setShow(show);
    booking.setDate(selectedDate);
    booking.setTime(show.time);

    navigate(`/movies/${id || activeMovie.id}/seats/${show.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <BookingStepper currentStep={2} />

      {/* BookMyShow Style Header */}
      {movie && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {movie.title} - ({movie.language || "Hindi"})
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                Movie runtime: {formatDuration(movie.runtimeMins)}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {movie.certification || "UA13+"}
              </span>
              {movie.genre?.map((g) => (
                <span key={g} className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* GPS Nearest Sort Button */}
            <button
              type="button"
              onClick={handleFetchGpsLocation}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer border ${
                sortByNearest
                  ? "bg-[#FF1744] text-white border-red-500 shadow-md shadow-red-500/20"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200"
              }`}
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>{geoStatus === "detecting" ? "Locating..." : sortByNearest ? "Nearest GPS (Active)" : "Nearest Theater"}</span>
            </button>

            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search theater in city..."
                className="pl-9 text-xs py-2 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* BookMyShow Date Selection Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {dateList.map((item) => {
            const isSelected = selectedDate === item.iso;
            return (
              <button
                key={item.iso}
                onClick={() => setSelectedDate(item.iso)}
                className={`flex flex-col items-center justify-center min-w-[70px] px-3 py-2 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FF1744] text-white font-black shadow-md shadow-red-500/30 scale-105"
                    : "text-slate-600 hover:bg-slate-100 font-extrabold"
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase opacity-85">{item.day}</span>
                <span className="text-lg leading-none font-extrabold my-0.5">{item.date}</span>
                <span className="text-[9px] tracking-wider uppercase opacity-85">{item.month}</span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-bold px-4 border-l border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>AVAILABLE</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>FAST FILLING</span>
          </div>
        </div>
      </div>

      {/* Theaters & Compact Showtimes Row List */}
      <div className="space-y-3">
        {list.length > 0 ? (
          list.map(({ theater, showList, distanceKm }) => (
            <div key={theater.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Theater Info */}
                <div className="space-y-1 min-w-[240px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-slate-900 hover:text-[#FF1744] transition cursor-pointer flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#FF1744] shrink-0" />
                      {theater.name}
                    </h3>

                    {/* GPS Distance Badge */}
                    {distanceKm !== null && distanceKm !== undefined && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                        <Navigation className="h-2.5 w-2.5" />
                        {distanceKm} km away
                      </span>
                    )}

                    <Info className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium pl-5">
                    {theater.area || theater.location || "City Center"} • <span className="text-slate-400">Non-cancellable</span>
                  </p>
                  {theater.facilities && (
                    <div className="flex flex-wrap gap-1 pl-5 pt-1">
                      {theater.facilities.slice(0, 3).map((f) => (
                        <span key={f} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Compact Showtimes Horizontal Pills */}
                <div className="flex-1 flex flex-wrap items-center gap-2.5 justify-start md:justify-end">
                  {showList.length > 0 ? (
                    showList.map((show, idx) => {
                      const isFast = idx % 3 === 1;
                      return (
                        <button
                          key={show.id}
                          onClick={() => handleSelectShow(theater, show)}
                          className={`group relative flex items-center justify-center px-4 py-2 rounded-xl border text-xs font-black transition-all duration-200 cursor-pointer shadow-2xs ${
                            isFast
                              ? "border-amber-500/80 text-amber-700 bg-amber-50/40 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                              : "border-emerald-500/80 text-emerald-700 bg-emerald-50/40 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                          }`}
                        >
                          <span>{formatTime(show.time)}</span>
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-0.5 px-2 rounded-md whitespace-nowrap pointer-events-none z-20 shadow-lg">
                            ₹180 - ₹450 • Silver/Gold/Recliner
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    // Default fallback showtimes if database has none for this specific theater
                    ["10:30", "14:15", "18:00", "21:30"].map((t, idx) => {
                      const targetMovieId = id || movie?.id || booking.state.movieId || "m1";
                      const mockShow = { 
                        id: `s-${targetMovieId}-${theater.id}-${selectedDate}-${t.replace(":", "")}`, 
                        time: t, 
                        date: selectedDate,
                        movieId: targetMovieId,
                        theaterId: theater.id,
                        basePrice: 180 
                      };
                      const isFast = idx % 2 === 1;
                      return (
                        <button
                          key={t}
                          onClick={() => handleSelectShow(theater, mockShow)}
                          className={`group relative flex items-center justify-center px-4 py-2 rounded-xl border text-xs font-black transition-all duration-200 cursor-pointer ${
                            isFast
                              ? "border-amber-500/80 text-amber-700 bg-amber-50/40 hover:bg-amber-500 hover:text-white"
                              : "border-emerald-500/80 text-emerald-700 bg-emerald-50/40 hover:bg-emerald-500 hover:text-white"
                          }`}
                        >
                          <span>{formatTime(t)}</span>
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-0.5 px-2 rounded-md whitespace-nowrap pointer-events-none z-20 shadow-lg">
                            ₹180 - ₹450 • Silver/Gold/Recliner
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={`No theaters found in ${loc.city}`}
            description="Try selecting another city from the location picker in the top menu bar or click Auto Detect."
            actionLabel="Auto Detect Location"
            onAction={() => loc.detect()}
          />
        )}
      </div>
    </div>
  );
}

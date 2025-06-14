import { MapContainer, TileLayer, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function ORSRouting({
  pointA,
  pointB,
  setRouteCoords,
  setDistance,
  setDuration,
}) {
  const map = useMap();

  useEffect(() => {
    const fetchRoute = async () => {
      if (!pointA || !pointB) return;

      const apiKey = import.meta.env.VITE_ORS_KEY;
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pointA.lng},${pointA.lat}&end=${pointB.lng},${pointB.lat}`;
      console.log("Fetching route from:", apiKey);
      try {
        const response = await fetch(url);
        const data = await response.json();

        const coords = data.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );

        setRouteCoords(coords);

        // Get distance in km and duration in minutes
        const summary = data.features[0].properties.summary;
        setDistance((summary.distance / 1000).toFixed(2)); // in km
        setDuration((summary.duration / 60).toFixed(2)); // in minutes

        map.fitBounds(coords);
      } catch (err) {
        console.error("ORS route error:", err);
        alert("Failed to get route from OpenRouteService");
      }
    };

    fetchRoute();
  }, [pointA, pointB, map, setRouteCoords, setDistance, setDuration]);

  return null;
}

export default function MapPage() {
  const user = JSON.parse(Cookies.get("user") || "{}");

  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const handleMapClick = (e) => {
    const latlng = { lat: e.latlng.lat, lng: e.latlng.lng };
    if (!pointA) setPointA(latlng);
    else if (!pointB) setPointB(latlng);
    else {
      setPointA(latlng);
      setPointB(null);
      setRouteCoords([]);
    }
  };

  const getCoordinates = async (place) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${place}&format=json&limit=1`;
      const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(
        url
      )}`;
      const response = await fetch(proxyURL);
      const data = await response.json();
      const parsed = JSON.parse(data.contents);

      if (parsed.length > 0) {
        const { lat, lon } = parsed[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        alert(`Location not found: ${place}`);
        return null;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch coordinates.");
      return null;
    }
  };

  const handleSearch = async () => {
    const fromCoords = await getCoordinates(fromInput);
    const toCoords = await getCoordinates(toInput);

    if (fromCoords && toCoords) {
      setPointA(fromCoords);
      setPointB(toCoords);
    }
  };

  return (
    <div className="h-screen w-full">
      {/* Header */}
      <div className="p-4 bg-white shadow-md z-10 absolute top-0 left-0 w-full flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">Hello, {user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <img
          src={user.photoURL}
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
      </div>

      {/* From & To Inputs */}
      <div className="absolute z-10 top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-lg flex gap-2">
        <input
          className="border border-gray-300 rounded px-3 py-1"
          type="text"
          placeholder="From"
          value={fromInput}
          onChange={(e) => setFromInput(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded px-3 py-1"
          type="text"
          placeholder="To"
          value={toInput}
          onChange={(e) => setToInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Find Route
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100vh", zIndex: 1 }}
        whenCreated={(mapInstance) => mapInstance.on("click", handleMapClick)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pointA && pointB && (
          <ORSRouting
            pointA={pointA}
            pointB={pointB}
            setRouteCoords={setRouteCoords}
            setDistance={setDistance}
            setDuration={setDuration}
          />
        )}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" weight={5} />
        )}
      </MapContainer>

      {distance && duration && (
        <div className="absolute top-1/2 left-1/2 z-50 transform -translate-x-1/2 bg-white p-2 rounded shadow text-sm text-gray-800">
          Distance: <strong>{distance} km</strong>, Duration:{" "}
          <strong>{duration} mins</strong>
        </div>
      )}
      {console.log("distance:", distance, "duration:", duration)}
    </div>
  );
}

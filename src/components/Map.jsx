// src/components/Map.jsx
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/firebase"; // your Firebase setup

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-72.2896, 43.7022],
      zoom: 14,
    });
    mapRef.current = map;

    // Fetch spots from Firebase
    const fetchSpots = async () => {
      const querySnapshot = await getDocs(collection(db, "spots"));
      const data = [];
      querySnapshot.forEach(doc => {
        const raw = doc.data();
        data.push({
          id: doc.id,
          ...raw,
          lat: raw.location.latitude,
          lon: raw.location.longitude
        });

      });
      setSpots(data);
    };

    fetchSpots();
    
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current || spots.length === 0) return;

    const map = mapRef.current;

    // Add markers from spots data
    spots.forEach(spot => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <img src="${spot.image}" alt="${spot.name}" style="width: 100%; border-radius: 5px;" />
        <h3>${spot.name}</h3>
        <p><a href="${spot.playlist}" target="_blank">🎵 Open Playlist</a></p>
      `);

      const marker = new mapboxgl.Marker({ color: "#0C9268" })
        .setLngLat([spot.lon, spot.lat])
        .setPopup(popup)
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        navigate(`/spot/${spot.id}`);
      });
    });
  }, [spots]);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      style={{ height: "100vh", width: "100%", borderRadius: "12px" }}
    />
  );
}

export default Map;

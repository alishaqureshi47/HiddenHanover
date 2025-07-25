// src/components/Map.jsx
import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import places from "../data/places";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-72.2896, 43.7022],
      zoom: 14,
    });

    mapRef.current = map;

    // Add markers with popups
    places.forEach(place => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <img src="${place.image}" alt="${place.name}" style="width: 100%; border-radius: 5px;" />
        <h3>${place.name}</h3>
        <p><a href="${place.playlist}" target="_blank" rel="noopener noreferrer">🎵 Open Playlist</a></p>
      `);

      new mapboxgl.Marker()
        .setLngLat([place.lon, place.lat])
        .setPopup(popup)
        .addTo(map);
    });

    return () => map.remove();
  }, []);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      style={{ height: "100vh", width: "100%", borderRadius: "12px" }}
    />
  );
}

export default Map;

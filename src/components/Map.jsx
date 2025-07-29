// src/components/Map.jsx
// Alisha Qureshi - 2025

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from 'react-router-dom';
import { Threebox } from 'threebox-plugin';
import 'threebox-plugin/dist/threebox.css';
import { useSpots } from "../context/SpotsContext";  
import * as THREE from "three"; 

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function Map({ weather, timeOfDay }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const { spots, loading } = useSpots();

  /*---- initialize map ----*/
  useEffect(() => {  
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/alishaqureshi/cmdmczzue008001s16t2b7ud9",
      center: [-72.28857, 43.70336],
      zoom: 16,
      pitch: 60,
      bearing: 20,
      antialias: true,
      cooperativeGestures: true
    });

    mapRef.current = map;

    map.on('load', () => {
      applyWeather(map, weather);
      if (timeOfDay) {
        map.setConfigProperty('basemap', 'lightPreset', timeOfDay);
      }
    });

    // ✅ Add Threebox layer
    map.on('style.load', () => {
      map.addLayer({
        id: "threebox-layer",
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, gl) {
          window.tb = new Threebox(map, gl, { defaultLights: true });
        },
        render: function () {
          window.tb.update();
        }
      });
    });

    return () => {
      if (window.tb) {
        // 🧹 clean up Threebox when leaving map
        window.tb.dispose();
        window.tb = null;
      }
      map.remove();
    };
  }, []);

  /*---- watch for weather changes ----*/
  useEffect(() => { 
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.isStyleLoaded()) {
      map.once("styledata", () => applyWeather(map, weather));
    } else {
      applyWeather(map, weather);
    }
  }, [weather]);

  const applyWeather = (map, weather) => {
    map.setRain(null);
    map.setSnow(null);
    if (weather === "rain") {
      map.setRain({ density: 0.5, intensity: 1.0, color: '#a8adbc', opacity: 0.7 });
    } else if (weather === "snow") {
      map.setSnow({ density: 0.5, intensity: 0.9, color: '#ffffff', opacity: 0.9 });
    }
  };

  /*---- watch for time of day ----*/
  useEffect(() => {
    if (mapRef.current && timeOfDay) {
      mapRef.current.setConfigProperty('basemap', 'lightPreset', timeOfDay);
    }
  }, [timeOfDay]);

  /*---- add & refresh 3D models whenever spots load ----*/
  useEffect(() => {
    if (!mapRef.current) return;
    if (loading) return;

    const map = mapRef.current;

    // ✅ Ensure Threebox exists
    if (!window.tb) {
      window.tb = new Threebox(map, map.getCanvas().getContext('webgl'), { defaultLights: true });
    }

    // 🧹 Clear existing models before adding new ones
    if (window.tb.world.children.length > 0) {
      window.tb.world.children
        .filter(obj => obj.userData?.spotId) // only remove spots, not lights
        .forEach(obj => window.tb.remove(obj));
    }

    const clickableModels = [];
    const popup = new mapboxgl.Popup({ closeButton: true, closeOnClick: true });

    spots.forEach((spot) => {
      if (!spot.location?.latitude || !spot.location?.longitude) return;

      const scale = spot.scale || 0.1;
      const options = {
        obj: spot.obj,
        type: "glb",
        scale: { x: scale, y: scale, z: scale },
        rotation: spot.rotation || { x: 90, y: -90, z: 0 },
        units: "meters"
      };

      window.tb.loadObj(options, (model) => {
        model.setCoords([spot.location.longitude, spot.location.latitude]);
        model.userData.spotId = spot.id;
        clickableModels.push(model);
        window.tb.add(model);
      });
    });

    // ✅ Raycasting for clicks
    if (!mapRef.current.hasClickListener) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      map.on("click", (event) => {
        const canvas = map.getCanvas();
        mouse.x = (event.point.x / canvas.clientWidth) * 2 - 1;
        mouse.y = -(event.point.y / canvas.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, window.tb.camera);
        const intersects = raycaster.intersectObjects(clickableModels, true);

        if (intersects.length > 0) {
          let clicked = intersects[0].object;
          while (clicked && !clicked.userData.spotId) {
            clicked = clicked.parent;
          }
          if (clicked && clicked.userData.spotId) {
            const clickedSpot = spots.find(s => s.id === clicked.userData.spotId);
            if (!clickedSpot) return;

            // 🎯 Fly to the clicked spot
            map.flyTo({
              center: [clickedSpot.location.longitude, clickedSpot.location.latitude],
              zoom: 18,
              speed: 1.2,
              curve: 1.2,
              essential: true
            });

            // 📍 Show popup with close button + name
            popup
              .setLngLat([clickedSpot.location.longitude, clickedSpot.location.latitude])
              .setHTML(`
                <div class="spot-popup">
                  <h3>${clickedSpot.name}</h3>
                  <p>Click to open</p>
                </div>
              `)
              .addTo(map);

            // ✅ Clicking popup content (not the close X) navigates
            popup.getElement().addEventListener("click", (e) => {
              if (!e.target.closest(".mapboxgl-popup-close-button")) {
                navigate(`/spot/${clickedSpot.id}`);
              }
            });
          }
        }
      });

      mapRef.current.hasClickListener = true;
    }
  }, [spots, loading]);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      className="map-container"
    />
  );
}

export default Map;

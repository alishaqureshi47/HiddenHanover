// src/components/Map.jsx
// Alisha Qureshi - 2025

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from 'react-router-dom';
import { Threebox } from 'threebox-plugin';
import 'threebox-plugin/dist/threebox.css';
import { useSpots } from "../context/SpotsContext";  // ✅ using global spots context
import * as THREE from "three"; 

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function Map({ weather, timeOfDay }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Spots pulled from context
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
      antialias: true
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

    // ✅ Cleanup when component unmounts
    return () => map.remove();
  }, []);

  /*---- watch for weather changes ----*/
  useEffect(() => { 
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (!map.isStyleLoaded()) {
      map.once("styledata", () => {
        applyWeather(map, weather);
      });
    } else {
      applyWeather(map, weather);
    }
  }, [weather]);

  /*---- helper to apply weather ----*/
  const applyWeather = (map, weather) => {
    map.setRain(null);
    map.setSnow(null);

    if (weather === "rain") {
      map.setRain({
        density: 0.5,
        intensity: 1.0,
        color: '#a8adbc',
        opacity: 0.7,
        vignette: 1.0,
        'vignette-color': '#464646',
        direction: [0, 80],
        'droplet-size': [2.6, 18.2],
        'distortion-strength': 0.7,
        'center-thinning': 0
      });
    } else if (weather === "snow") {
      map.setSnow({
        density: 0.5,
        intensity: 0.9,
        color: '#ffffff',
        opacity: 0.9,
        'flake-size': 5,
        'distortion-strength': 0.2
      });
    }
  };

  /*---- watch for time of day ----*/
  useEffect(() => {
    if (mapRef.current && timeOfDay) {
      mapRef.current.setConfigProperty('basemap', 'lightPreset', timeOfDay);
    }
  }, [timeOfDay]);

  /*---- add 3D models whenever spots load OR when coming back ----*/
  useEffect(() => {
    if (!mapRef.current) return;
    if (loading) {
      console.log("⏳ Waiting for spots...");
      return;
    }

    if (spots.length === 0) {
      console.warn("⚠️ No spots found.");
      return;
    }

    console.log(`✅ Loading ${spots.length} spots onto the map.`);
    const map = mapRef.current;

    // ✅ Ensure Threebox exists for this map instance
    if (!window.tb) {
      window.tb = new Threebox(map, map.getCanvas().getContext('webgl'), { defaultLights: true });
    }

    const clickableModels = [];

    spots.forEach((spot) => {
      if (!spot.location?.latitude || !spot.location?.longitude) {
        console.warn(`⚠️ Skipping ${spot.name || spot.id} — no location data`);
        return;
      }

      const scale = 0.1;
      const options = {
        obj: spot.obj,
        type: "glb",
        scale: spot.scale || { x: scale, y: scale, z: scale },
        rotation: spot.rotation || { x: 90, y: -90, z: 0 },
        units: "meters"
      };

      // ✅ Load the model for each spot
      window.tb.loadObj(options, (model) => {
        model.setCoords([spot.location.longitude, spot.location.latitude]);
        model.userData.spotId = spot.id;
        clickableModels.push(model);
        window.tb.add(model);
      });
    });

    // ✅ Raycasting for spot clicks (only set up once)
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
            console.log("✅ Clicked spot:", clicked.userData.spotId);
            navigate(`/spot/${clicked.userData.spotId}`);
          }
        }
      });

      mapRef.current.hasClickListener = true;
    }

  }, [spots, loading]);  // ✅ reruns when spots finish loading

  return (
    <div
      id="map"
      ref={mapContainerRef}
      className="map-container"
    />
  );
}

export default Map;

// src/components/Map.jsx
// Alisha Qureshi - 2025

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/firebase"; 
import { Threebox } from 'threebox-plugin';
import 'threebox-plugin/dist/threebox.css';

import * as THREE from "three"; 

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);

  /*----initialize map and fetch from firebase----*/
  useEffect(() => {
    // map initialization
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

    // loading threebox plug in
    map.on('style.load', () => {
      // to disable labels 
      // map.getStyle().layers.forEach((layer) => {
      //   if (layer.type === 'symbol') {
      //     map.setLayoutProperty(layer.id, 'visibility', 'none');
      //   }
      // });

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

    // fetch from firebase
    const fetchSpots = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "spots"));

        if (querySnapshot.empty) {
          console.warn("No documents found in 'spots' collection.");
        }

        const data = querySnapshot.docs.map(doc => {
          const raw = doc.data();

          // check for geopoint
          if (!raw.location || !raw.location.latitude) {
            console.error(`Missing GeoPoint for ${doc.id}`, raw);
          }

          return {
            id: doc.id,
            ...raw,
            lat: raw.location?.latitude || null,
            lon: raw.location?.longitude || null,
          };
        });

        setSpots(data);
      } catch (err) {
        console.error("Firebase fetch error:", err);
      }
    };

    fetchSpots();

    return () => map.remove();
  }, []);


  /*----loading 3D models for each spot----*/
  useEffect(() => {
    if (!mapRef.current) {
      console.log("Map not ready yet");
      return;
    }

    if (spots.length === 0) {
      console.log("Waiting for Firestore…");
      return;
    }

    // setting up Threebox
    const map = mapRef.current;
    window.tb = new Threebox(map, map.getCanvas().getContext('webgl'), { defaultLights: true });

    const clickableModels = []; 

    spots.forEach((spot) => {
      console.log(`Loading model for: ${spot.name || spot.id}`, spot);

      const scale = 0.1;
      const options = {
        obj: spot.obj, 
        type: "glb",
        scale: spot.scale || { x: scale, y: scale, z: scale },
        rotation: spot.rotation || { x: 90, y: -90, z: 0 },
        units: "meters"
      };

      window.tb.loadObj(options, (model) => {
        model.setCoords([spot.lon, spot.lat]);

        model.userData.spotId = spot.id;  

        clickableModels.push(model);

        window.tb.add(model);
      });
    });

    // setup raycasting for model clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    map.on("click", (event) => {
      const canvas = map.getCanvas();

      mouse.x = (event.point.x / canvas.clientWidth) * 2 - 1;
      mouse.y = -(event.point.y / canvas.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, window.tb.camera);

      const intersects = raycaster.intersectObjects(clickableModels, true);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;

        let spotObj = clicked;
        while (spotObj && !spotObj.userData.spotId) {
          spotObj = spotObj.parent;
        }

        if (spotObj && spotObj.userData.spotId) {
          console.log("✅ Clicked spot:", spotObj.userData.spotId);
          navigate(`/spot/${spotObj.userData.spotId}`);
        }
      }
    });

  }, [spots]);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      className="map-container"
    />
  );
}

export default Map;
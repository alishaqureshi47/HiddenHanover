// src/components/AddSpot.jsx
import { useState, useEffect } from "react";
import { db } from "../api/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./AddSpot.css";
import { auth } from "../api/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const storage = getStorage();

function AddSpot({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [obj, setObj] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);
  const [user] = useAuthState(auth);
  const [isPublic, setIsPublic] = useState(true);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [scale, setScale] = useState(0.1);  // ✅ NEW: scale slider

  // 🗺️ Set up map for choosing location
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "add-spot-map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-72.28857, 43.70336],
      zoom: 14,
    });

    setTimeout(() => map.resize(), 200);

    let marker = null;

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setLat(lat.toFixed(6));
      setLng(lng.toFixed(6));

      // ✅ Use marker for location picking (just visual feedback)
      if (marker) {
        marker.setLngLat([lng, lat]);
      } else {
        marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
      }
    });

    return () => map.remove();
  }, []);

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a spot!");
      return;
    }

    try {
      // Upload any images
      let imageUrls = [];
      if (images.length > 0) {
        const uploadPromises = images.map(async (file) => {
          const fileRef = ref(storage, `spots/${Date.now()}-${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        });
        imageUrls = await Promise.all(uploadPromises);
      }

      // Add to Firestore
      await addDoc(collection(db, "spots"), {
        name,
        description,
        obj,
        scale,   // ✅ Save the chosen scale
        location: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        images: imageUrls,
        createdAt: new Date(),
        ownerId: user.uid,
        ownerName: user.displayName,
        isPublic,
        spotifyPlaylist: spotifyUrl,
      });

      alert("✅ Spot added successfully!");
      onClose();
    } catch (err) {
      console.error("❌ Error adding spot:", err);
      alert("❌ Failed to add spot.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Add New Spot</h2>

        <form onSubmit={handleSubmit} className="add-spot-form">
          <div className="form-layout">
            {/* LEFT SIDE FORM */}
            <div className="form-left">
              <label>Spot Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dartmouth Green"
                required
              />

              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description..."
                required
              />

              <label>Choose an Icon</label>
              <select value={obj} onChange={(e) => setObj(e.target.value)} required>
                <option value="">-- Select Icon --</option>
                <option value="https://firebasestorage.googleapis.com/v0/b/hidden-hanover-dali-app.firebasestorage.app/o/icons%2Fbook_stack.glb?alt=media&token=ee421a69-16e3-42b8-8cc8-f2f36893ad62">📚 Book Stack</option>
                <option value="https://firebasestorage.googleapis.com/v0/b/hidden-hanover-dali-app.firebasestorage.app/o/icons%2Fpark_table.glb?alt=media&token=0bf4f0eb-e597-478e-aa0d-855422ed1ad1">🪑 Park Table</option>
                <option value="https://firebasestorage.googleapis.com/v0/b/hidden-hanover-dali-app.firebasestorage.app/o/icons%2Fpine_cone.glb?alt=media&token=657371d5-4274-42c0-bba5-78f43c6532f4">🌲 Pine Cone</option>
                <option value="https://firebasestorage.googleapis.com/v0/b/hidden-hanover-dali-app.firebasestorage.app/o/icons%2Fpine_tree.glb?alt=media&token=272e4555-795d-451e-b562-fa170c6a9288">🌲 Lone Pine</option>
                <option value="https://firebasestorage.googleapis.com/v0/b/hidden-hanover-dali-app.firebasestorage.app/o/icons%2Fwooden_park_bench.glb?alt=media&token=6688bac7-dec6-411b-8c09-01c3561b5c63">🪵 Park Bench</option>
              </select>

              {/* ✅ SCALE SLIDER */}
              <label>Model Scale</label>
              <input
                type="range"
                min="0.05"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
              <p>Current scale: {scale.toFixed(2)}</p>

              {/* ✅ IMAGE UPLOAD */}
              <label>Upload Images</label>
              <div className="file-upload-wrapper">
                <label className="file-upload-btn">
                  📂 Choose Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                  />
                </label>
              </div>

              <div className="file-preview-list">
                {images.length > 0 ? (
                  images.map((file, index) => (
                    <div key={index} className="file-preview-item">
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                      <span>{file.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-files">No files selected</p>
                )}
              </div>

              {/* ✅ SPOTIFY URL */}
              <div className="playlist">
                <label>Spotify Playlist URL (optional)</label>
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="Paste Spotify playlist link here"
                />
              </div>
            </div>

            {/* RIGHT SIDE MAP */}
            <div className="form-right">
              <label>Privacy</label>
              <select value={isPublic} onChange={(e) => setIsPublic(e.target.value === "true")}>
                <option value="true">🌍 Public</option>
                <option value="false">🔒 Private</option>
              </select>

              <label className="location-head">Select Location on Map</label>
              <p style={{ fontSize: "0.9rem", marginBottom: "5px" }}>
                📍 Click on the map to set coordinates
              </p>
              <div id="add-spot-map" style={{ width: "100%", height: "350px", borderRadius: "8px" }}></div>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">☑️ Add Spot</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSpot;

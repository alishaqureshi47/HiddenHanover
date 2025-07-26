// src/components/AddSpot.jsx
import { useState } from "react";
import { db } from "../api/firebase";
import { collection, addDoc } from "firebase/firestore";
import "./AddSpot.css";

function AddSpot({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [image, setImage] = useState(null);

  // ✅ handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "spots"), {
        name,
        description,
        icon,
        location: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
        image: image ? URL.createObjectURL(image) : "", // 🔹 For now just preview, later we’ll upload to storage
        createdAt: new Date(),
      });

      alert("✅ Spot added successfully!");
      onClose();
    } catch (err) {
      console.error("🔥 Error adding spot:", err);
      alert("❌ Failed to add spot.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>➕ Add New Spot</h2>

        <form onSubmit={handleSubmit} className="add-spot-form">
          {/* 📍 Name */}
          <label>Spot Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dartmouth Green"
            required
          />

          {/* 📝 Description */}
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description..."
            required
          />

          {/* 🎯 Icon Selection */}
          <label>Choose an Icon</label>
          <select value={icon} onChange={(e) => setIcon(e.target.value)} required>
            <option value="">-- Select Icon --</option>
            <option value="/icons/tree.png">🌳 Tree</option>
            <option value="/icons/bench.png">🪑 Bench</option>
            <option value="/icons/statue.png">🗿 Statue</option>
            {/* 🔹 Add more icons in /public/icons and add options here */}
          </select>

          {/* 📌 Location (coords for now) */}
          <label>Latitude</label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="43.70336"
            required
          />

          <label>Longitude</label>
          <input
            type="number"
            step="any"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="-72.28857"
            required
          />

          {/* 🖼 Image Upload */}
          <label>Upload an Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* ✅ Submit + Cancel */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn">✅ Add Spot</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSpot;

import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../api/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './SpotPage.css';
import { useSpots } from "../context/SpotsContext";  // ✅ use the context

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

function SpotPage() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { spots, setSpots } = useSpots();   // ✅ include setSpots from context
  const [uploading, setUploading] = useState(false);

  const storage = getStorage();

  // 🔄 Find the spot in context
  const spot = spots.find(s => s.id === spotId);

  if (!spot) return <p style={{ color: "black" }}>Spot not found.</p>;

  // 📤 Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      // 📂 Upload to Firebase Storage
      const storageRef = ref(storage, `spots/${spotId}/${file.name}`);
      await uploadBytes(storageRef, file);

      // 🌐 Get Download URL
      const downloadURL = await getDownloadURL(storageRef);

      // 🔄 Update Firestore (push to images array)
      const docRef = doc(db, "spots", spotId);
      await updateDoc(docRef, {
        images: arrayUnion(downloadURL)
      });

      // ✅ Update the global spots context so UI updates immediately
      setSpots(prevSpots =>
        prevSpots.map(s =>
          s.id === spotId
            ? { ...s, images: s.images ? [...s.images, downloadURL] : [downloadURL] }
            : s
        )
      );

      setUploading(false);
      alert("✅ Image uploaded!");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <div className="spot-page" style={{ color: "black" }}>
      {/* 🔙 Back Button */}
      <button onClick={() => navigate('/map')} className="back-btn">
        Back to Map
      </button>

      {/* 📍 Title */}
      <h1 className="spot-title">📍 {spot.name}</h1>

      {/* 📝 Description */}
      {spot.description && (
        <p className="spot-description">{spot.description}</p>
      )}

      {/* 🖼 Full-width Gallery */}
      <div className="gallery-section">
        <div className="gallery-header">
          <h2>Gallery</h2>
          <label className="upload-btn">
            + Add Image
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>
        {uploading && <p className="uploading-text">Uploading...</p>}

        {(spot.images && spot.images.length > 0) || spot.image ? (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            className="gallery-swiper"
          >
            {/* ✅ Show main image first if it exists */}
            {spot.image && (
              <SwiperSlide>
                <img src={spot.image} alt={spot.name} className="gallery-image" />
              </SwiperSlide>
            )}

            {/* ✅ Then loop through uploaded images */}
            {spot.images &&
              spot.images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`${spot.name} ${idx}`} className="gallery-image" />
                </SwiperSlide>
              ))}
          </Swiper>
        ) : (
          <div className="gallery-placeholder">
            <p>No images yet.</p>
          </div>
        )}
      </div>

      {/* 🎵 Spotify + 📓 Journal */}
      <div className="bottom-grid">
        <div className="spotify-section">
          <h2>🎵 Spotify Playlist</h2>
          {spot.playlist ? (
            <iframe
              src={spot.playlist}
              width="100%"
              height="250"
              allow="encrypted-media"
              title="Spotify Playlist"
              style={{ borderRadius: '8px', border: '2px solid black' }}
            ></iframe>
          ) : (
            <p>No playlist added.</p>
          )}
        </div>

        <div className="journal-section">
          <h2>📓 Journal Entries</h2>
          {spot.journalEntries && spot.journalEntries.length > 0 ? (
            spot.journalEntries.map((entry, idx) => (
              <div key={idx} className="journal-entry">
                <p>{entry}</p>
              </div>
            ))
          ) : (
            <p>No journal entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpotPage;

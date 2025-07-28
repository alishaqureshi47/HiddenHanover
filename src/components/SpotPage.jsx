import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import './SpotPage.css';
import { useSpots } from "../context/SpotsContext";  

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import SpotifyEmbed from './SpotifyEmbed';


function SpotPage() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { spots, setSpots } = useSpots();   
  const [uploading, setUploading] = useState(false);
  const [user] = useAuthState(auth);

  const storage = getStorage();

  // 🔄 Find the spot in context
  const spot = spots.find(s => s.id === spotId);

  if (!spot) return <p style={{ color: "black" }}>Spot not found.</p>;

  const isOwner = user && spot.ownerId === user.uid;

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

      // ✅ Update context
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

  // 🔄 Handle Privacy Toggle
  const handleTogglePrivacy = async () => {
    try {
      const docRef = doc(db, "spots", spotId);
      await updateDoc(docRef, {
        isPublic: !spot.isPublic
      });

      setSpots(prevSpots =>
        prevSpots.map(s =>
          s.id === spotId ? { ...s, isPublic: !spot.isPublic } : s
        )
      );
    } catch (err) {
      console.error("❌ Privacy toggle failed:", err);
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
          {isOwner && (
            <label className="upload-btn">
              + Add Image
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          )}
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
            {spot.image && (
              <SwiperSlide>
                <img src={spot.image} alt={spot.name} className="gallery-image" />
              </SwiperSlide>
            )}

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
          <div className="spotify-header">
            <h2>🎵 Spotify Playlist</h2>
            {!spot.spotifyPlaylist && (
              <button 
                className="add-playlist-btn" 
                onClick={async () => {
                  const playlistUrl = prompt("🎵 Paste a Spotify playlist URL:");

                  if (playlistUrl) {
                    try {
                      // ✅ Update Firestore
                      await updateDoc(doc(db, "spots", spotId), {
                        spotifyPlaylist: playlistUrl,
                      });

                      // ✅ Update local state immediately
                      setSpots(prevSpots =>
                        prevSpots.map(s =>
                          s.id === spotId ? { ...s, spotifyPlaylist: playlistUrl } : s
                        )
                      );

                      alert("✅ Playlist added!");
                    } catch (err) {
                      console.error("❌ Error saving playlist:", err);
                      alert("❌ Failed to add playlist.");
                    }
                  }
                }}
              >
                +
              </button>
            )}
            <ConnectSpotify />
          </div>
          {spot.spotifyPlaylist ? (   
            <SpotifyEmbed playlistUrl={spot.spotifyPlaylist} />
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

      <div className="owner-info">
        {spot.ownerName && (
          <p className="spot-owner">
            Created by <strong>{spot.ownerName}</strong> — {spot.isPublic ? "🔓 Public" : "🔒 Private"}
          </p>
        )}

        {isOwner && (
          <button className="privacy-toggle" onClick={handleTogglePrivacy}>
            {spot.isPublic ? "Make Private 🔒" : "Make Public 🔓"}
          </button>
        )}
      </div>
    </div>
  );
}

export default SpotPage;

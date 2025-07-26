// src/components/SpotPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../api/firebase';
import './SpotPage.css';

function SpotPage() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    const fetchSpot = async () => {
      const docRef = doc(db, "spots", spotId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSpot(docSnap.data());
      } else {
        setSpot(null);
      }
    };

    fetchSpot();
  }, [spotId]);

  if (spot === null) return <p>Spot not found.</p>;

  return (
    <div className="spot-page">
      <button onClick={() => navigate('/map')}>← Back to Map</button>
      <h2>{spot.name}</h2>
      <p>{spot.description}</p>
      <img src={spot.image} alt={spot.name} className="spot-image" />
      <iframe
        src={spot.playlist}
        width="100%"
        height="80"
        allow="encrypted-media"
        title="Spotify Playlist"
      ></iframe>
    </div>
  );
}

export default SpotPage;

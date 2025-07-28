import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";

const SpotsContext = createContext();

export function SpotsProvider({ children }) {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Fetch spots only once
  useEffect(() => {
    async function fetchSpots() {
      try {
        const querySnapshot = await getDocs(collection(db, "spots"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpots(data);
      } catch (err) {
        console.error("❌ Error fetching spots:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpots();
  }, []);

  // ✅ Provide a way to refresh if we ever need to
  const refreshSpots = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "spots"));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSpots(data);
    setLoading(false);
  };

  return (
    <SpotsContext.Provider value={{ spots, setSpots, loading, error, refreshSpots }}>
      {children}
    </SpotsContext.Provider>
  );
}

export function useSpots() {
  return useContext(SpotsContext);
}

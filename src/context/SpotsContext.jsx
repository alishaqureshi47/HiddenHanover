import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../api/firebase";

const SpotsContext = createContext();

export function SpotsProvider({ children }) {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth); // ✅ know who's logged in

  useEffect(() => {
    setLoading(true);

    // ✅ Build query: Show all public spots + private spots that belong to user
    const spotsRef = collection(db, "spots");
    const q = query(spotsRef); // we can later refine this if we add "friends-only"

    // ✅ Subscribe to Firestore in real-time
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((spot) => {
            // ✅ If spot is public → show to everyone
            if (spot.isPublic) return true;
            // ✅ If spot is private → show only to owner
            if (user && spot.ownerId === user.uid) return true;
            return false;
          });

        setSpots(data);
        setLoading(false);
      },
      (err) => {
        console.error("❌ Error fetching spots:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // ✅ clean up listener
  }, [user]); // ✅ refetch spots whenever user changes (login/logout)

  // ✅ Provide a way to manually refresh if we ever need to
  const refreshSpots = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "spots"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSpots(data);
    } catch (err) {
      console.error("❌ Error refreshing spots:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
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

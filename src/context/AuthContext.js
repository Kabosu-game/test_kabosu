import React, { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase_app from "../firebase/config";
import logout from "../firebase/auth/logout";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    console.log('useEffect onAuthStateChanged called');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('user', user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          console.log('userDoc', userDoc);
          const userData = userDoc.data();
          setUser({ ...user, ...userData });
          setRole(userData.role || ''); // Set the role if it exists
        } else {
          console.log('userDoc does not exist');
          setUser(user);
          setRole(''); // Set default role if user document does not exist
        }
      } else {
        console.log('no user');
        setUser(null);
        setRole(''); // Reset role when no user is authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

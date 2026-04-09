import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for admin user first
    const currentAdmin = localStorage.getItem("currentAdmin");
    if (currentAdmin) {
      try {
        const admin = JSON.parse(currentAdmin);
        // Create a mock user object for admin users
        setUser({
          uid: "admin-" + admin.email,
          email: admin.email,
          displayName: "Admin",
          isAdmin: true
        });
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
      return;
    }

    // Check for direct login student
    const currentStudent = localStorage.getItem("currentStudent");
    if (currentStudent) {
      try {
        const student = JSON.parse(currentStudent);
        // Create a mock user object for direct login students
        setUser({
          uid: student.id,
          email: student.email,
          displayName: student.name,
          isDirectLogin: true
        });
      } catch (error) {
        console.error("Error parsing student data:", error);
      }
    } else {
      // Listen for Firebase auth changes
      const unsub = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsub();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

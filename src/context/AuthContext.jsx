import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // En tu AuthContext.js
  useEffect(() => {
    const getSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (!data.user && !loading) {
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, []);

  const register = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al registrar");
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al iniciar sesión");
    }

    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_BACKEND}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
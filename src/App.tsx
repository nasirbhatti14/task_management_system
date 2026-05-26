import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app we would validate the token with the backend
    const token = localStorage.getItem("token");
    if (token) {
      // Decode JWT for user info purely client side for local state
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, username: payload.username });
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-indigo-600 animate-spin"></div></div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <AuthPage onLogin={setUser} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/" 
        element={user ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

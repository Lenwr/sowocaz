import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profil from "./views/profilView.jsx";
import AdminDashboard from "./Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import LoginPage from "./views/LoginPage";

const App = () => {
  return (
    <Router>
      <div className="w-screen min-h-screen bg-white">
        <Routes>
          {/* Page publique */}
          <Route path="/" element={<Profil />} />

          {/* Page de connexion */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard admin sécurisé */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

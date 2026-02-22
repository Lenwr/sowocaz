import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // ✅ pas besoin de localStorage: Firestore check request.auth (Firebase Auth)
      navigate("/admin");
    } catch (error) {
      console.error("🔥 Login error:", error);
      alert(`Échec connexion: ${error?.code || ""} ${error?.message || ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d1a]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80 text-center"
      >
        <img
          src="/soLogo.png"
          alt="Sow Ocaz"
          className="w-16 h-16 mx-auto rounded-full mb-4 shadow-md"
        />

        <h2 className="text-xl font-bold mb-2 text-gray-800">
          Connexion Administrateur
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Connecte-toi avec ton compte admin Firebase
        </p>

        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md w-full p-2 mb-3 text-black focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 text-black rounded-md w-full p-2 mb-4 focus:outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#07c2e5] text-white py-2 rounded-md w-full hover:bg-[#06a0bd] disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
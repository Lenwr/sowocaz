import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Échec de la connexion : vérifie ton email et mot de passe.");
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
          className="bg-[#07c2e5] text-white py-2 rounded-md w-full hover:bg-[#06a0bd]"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminDashboard = () => {
  const [produits, setProduits] = useState([]);

  const [form, setForm] = useState({
    nom: "",
    image: "", // une seule image (URL)
    description: "",
    dimensions: "", // ex: "L 30 x l 20 x H 10 cm"
    prix: "",
  });

  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const produitsRef = useMemo(() => collection(db, "produits"), []);

  // --- Récupérer la liste des produits ---
  const fetchProduits = async () => {
    const snapshot = await getDocs(produitsRef);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setProduits(list);
  };

  useEffect(() => {
    fetchProduits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Gestion des champs ---
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // --- Upload image ---
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      const storageRef = ref(storage, `produits/${uniqueId}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setForm((prev) => ({ ...prev, image: downloadURL }));
      alert("✅ Image uploadée avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’upload de l’image ❌");
    } finally {
      setUploading(false);
    }
  };

  // --- Ajouter / Modifier ---
  const handleSave = async () => {
    if (!form.nom.trim() || !form.image.trim()) {
      alert("⚠️ Le nom et une image sont obligatoires !");
      return;
    }

    const data = {
      nom: form.nom.trim(),
      image: form.image.trim(),
      prix: form.prix.trim(),
      description: form.description.trim(),
      dimensions: form.dimensions.trim(),
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "produits", editId), data);
        setEditId(null);
        alert("✅ Produit mis à jour !");
      } else {
        await addDoc(produitsRef, data);
        alert("✅ Produit ajouté !");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’enregistrement du produit.");
    }

    setForm({ nom: "", image: "", description: "", dimensions: "", prix: "" });
    setPreview(null);
    fetchProduits();
  };

  // --- Edit ---
  const handleEdit = (p) => {
    setForm({
      nom: p.nom || "",
      image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "",
      prix: p.prix || "",
      description: p.description || "",
      dimensions: p.dimensions || "",
    });
    setPreview(p.image || (Array.isArray(p.images) ? p.images[0] : null) || null);
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      await deleteDoc(doc(db, "produits", id));
      fetchProduits();
    }
  };

  // --- Logout ---
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("adminAuth");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
      >
        🔐 Déconnexion
      </button>

      <h1 className="text-3xl font-bold text-center text-[#0d0d1a] mb-10">
        Dashboard Sow Ocaz ⚙️
      </h1>

      {/* --- LISTE/TABLE DES PRODUITS --- */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h2 className="font-semibold text-lg text-gray-800">
            🧾 Produits enregistrés ({produits.length})
          </h2>
        </div>

        {produits.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            Aucun produit enregistré pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left p-3">Image</th>
                  <th className="text-left p-3">Nom</th>
                  <th className="text-left p-3">Prix</th>
                  <th className="text-left p-3">Dimensions</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {produits.map((p) => {
                  const img =
                    p.image || (Array.isArray(p.images) ? p.images[0] : "");
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        {img ? (
                          <img
                            src={img}
                            alt={p.nom}
                            className="h-12 w-12 object-cover rounded-md border"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3 font-medium text-gray-900">{p.nom}</td>
                      <td className="p-3 text-[#07c2e5] font-semibold">
                        {p.prix || "—"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {p.dimensions || "—"}
                      </td>
                      <td className="p-3 text-gray-600 max-w-[420px]">
                        <span className="line-clamp-2">
                          {p.description || "—"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-[#07c2e5] hover:underline"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:underline"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- FORMULAIRE --- */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editId ? "✏️ Modifier un produit" : "➕ Ajouter un produit"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Nom du produit *
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Ex : Chaise vintage"
              className="mt-1 border border-gray-300 rounded-md w-full p-2 text-gray-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Prix</label>
            <input
              type="text"
              name="prix"
              value={form.prix}
              onChange={handleChange}
              placeholder="Ex : 200 €"
              className="mt-1 border border-gray-300 rounded-md w-full p-2 text-gray-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Dimensions
            </label>
            <input
              type="text"
              name="dimensions"
              value={form.dimensions}
              onChange={handleChange}
              placeholder="Ex : L 30 x l 20 x H 10 cm"
              className="mt-1 border border-gray-300 rounded-md w-full p-2 text-gray-900"
            />
          </div>

          {/* Upload image */}
          <div className="md:col-span-2 border border-gray-300 rounded-md p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Image *</p>
                <p className="text-xs text-gray-500">
                  Upload Firebase Storage ou colle une URL
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-sm text-gray-900"
              />
            </div>

            {uploading && (
              <p className="text-xs text-gray-500 mt-2">Upload en cours...</p>
            )}

            <div className="mt-3 grid md:grid-cols-[1fr_auto] gap-3 items-start">
              <input
                type="text"
                name="image"
                placeholder="URL de l'image"
                value={form.image}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full p-2 text-gray-900"
              />

              {(preview || form.image) && (
                <img
                  src={preview || form.image}
                  alt="aperçu"
                  className="h-24 w-24 object-cover rounded-md border"
                />
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décris le produit (état, détails, matière, etc.)"
              className="mt-1 border border-gray-300 rounded-md w-full p-2 text-gray-900 min-h-[120px]"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-[#07c2e5] text-white px-4 py-2 rounded-md w-full hover:bg-[#06a0bd] transition disabled:opacity-50"
            >
              {editId ? "💾 Enregistrer les modifications" : "🚀 Ajouter le produit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

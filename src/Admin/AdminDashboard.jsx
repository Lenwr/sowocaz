import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage, auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/** Extract dims -> numbers (pour tri/firestore) */
const extractDims = (dimensions) => {
  if (!dimensions)
    return { largeur: null, hauteur: null, profondeur: null, volume: null };

  const s = String(dimensions).replace(",", ".").toLowerCase().trim();

  // "85L/200H"
  const m1 = s.match(/(\d+(?:\.\d+)?)\s*l\s*\/\s*(\d+(?:\.\d+)?)\s*h/);
  if (m1) {
    const largeur = Number(m1[1]);
    const hauteur = Number(m1[2]);
    return { largeur, hauteur, profondeur: null, volume: null };
  }

  // "L 30 x l 20 x H 10"
  const hasLetters = /[ldh]/.test(s);
  if (hasLetters) {
    const wMatch = s.match(/(?:^|[\s/])l\s*[:=]?\s*(\d+(?:\.\d+)?)/);
    const dMatch = s.match(/(?:^|[\s/])d\s*[:=]?\s*(\d+(?:\.\d+)?)/);
    const hMatch = s.match(/(?:^|[\s/])h\s*[:=]?\s*(\d+(?:\.\d+)?)/);

    const largeur = wMatch ? Number(wMatch[1]) : null;
    const profondeur = dMatch ? Number(dMatch[1]) : null;
    const hauteur = hMatch ? Number(hMatch[1]) : null;

    const volume =
      largeur && hauteur && profondeur ? largeur * hauteur * profondeur : null;
    return { largeur, hauteur, profondeur, volume };
  }

  // fallback 3 nombres: 30x20x10
  const nums = s.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const largeur = nums[0] ?? null;
  const profondeur = nums[1] ?? null;
  const hauteur = nums[2] ?? null;
  const volume =
    largeur && hauteur && profondeur ? largeur * hauteur * profondeur : null;

  return { largeur, hauteur, profondeur, volume };
};

const AdminDashboard = () => {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ dimensions: "", image: "", prix: "" });

  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const produitsRef = useMemo(() => collection(db, "produits"), []);

  // ✅ Auth debug
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
      console.log("AUTH STATE:", user ? `✅ ${user.uid}` : "❌ null");
    });
    return () => unsub();
  }, []);

  const fetchProduits = async () => {
    const snapshot = await getDocs(produitsRef);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    // option : tri du + récent au + ancien si createdAt existe
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setProduits(list);
  };

  useEffect(() => {
    fetchProduits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      console.error("🔥 Storage upload failed:", err);
      alert(`❌ Storage: ${err?.code || ""} ${err?.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.dimensions.trim() || !form.image.trim() || !form.prix.trim()) {
      alert("⚠️ Dimensions, image et prix sont obligatoires !");
      return;
    }

    if (!auth.currentUser) {
      alert("❌ Tu n'es pas connecté Firebase Auth. Firestore va refuser.");
      return;
    }

    const dims = extractDims(form.dimensions.trim());

    const data = {
      dimensions: form.dimensions.trim(),
      image: form.image.trim(),
      prix: form.prix.trim(),
      ...dims,
      createdAt: editId ? undefined : Date.now(),
      updatedAt: Date.now(),
    };
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    try {
      if (editId) {
        await updateDoc(doc(db, "produits", editId), data);
        setEditId(null);
        alert("✅ Produit mis à jour !");
      } else {
        await addDoc(collection(db, "produits"), data);
        alert("✅ Produit ajouté !");
      }

      setForm({ dimensions: "", image: "", prix: "" });
      setPreview(null);
      await fetchProduits();
    } catch (err) {
      console.error("🔥 Firestore write failed:", err);
      alert(`❌ Firestore: ${err?.code || ""} ${err?.message || err}`);
    }
  };

  const handleEdit = (p) => {
    setForm({
      dimensions: p.dimensions || "",
      image: p.image || "",
      prix: p.prix || "",
    });
    setPreview(p.image || null);
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await deleteDoc(doc(db, "produits", id));
      await fetchProduits();
    } catch (err) {
      console.error("🔥 Firestore delete failed:", err);
      alert(`❌ Firestore delete: ${err?.code || ""} ${err?.message || err}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("adminAuth");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header sticky responsive */}
      <div className="sticky top-0 z-20 bg-[#f9fafb]/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0d0d1a]">
              Dashboard Sow Ocaz ⚙️
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Gestion des produits (dimensions / prix / image)
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg"
          >
            🔐 Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Auth badge */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-gray-700">
              {authReady ? (
                authUser ? (
                  <span className="text-green-600 font-semibold">
                    connecté ({authUser.email || authUser.uid})
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">non connecté</span>
                )
              ) : (
                <span className="text-gray-500">chargement…</span>
              )}
            </p>
          </div>
        </div>

        {/* FORM responsive */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {editId ? "✏️ Modifier un produit" : "➕ Ajouter un produit"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Champs obligatoires : dimensions, prix, image
              </p>
            </div>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ dimensions: "", image: "", prix: "" });
                  setPreview(null);
                }}
                className="text-xs sm:text-sm text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg"
              >
                Annuler
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dimensions */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Dimensions *
              </label>
              <input
                type="text"
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                placeholder='Ex : "85L/200H"'
                className="mt-1 border border-gray-300 rounded-lg w-full p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#07c2e5]/40"
              />
            </div>

            {/* Prix */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Prix *</label>
              <input
                type="text"
                name="prix"
                value={form.prix}
                onChange={handleChange}
                placeholder="Ex : 200 €"
                className="mt-1 border border-gray-300 rounded-lg w-full p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#07c2e5]/40"
              />
            </div>

            {/* Image */}
            <div className="sm:col-span-2 border border-gray-200 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Image *</p>
                  <p className="text-xs text-gray-500">
                    Upload Storage ou colle une URL
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

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
                <input
                  type="text"
                  name="image"
                  placeholder="URL de l'image"
                  value={form.image}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#07c2e5]/40"
                />

                {(preview || form.image) && (
                  <img
                    src={preview || form.image}
                    alt="aperçu"
                    className="w-full sm:w-28 h-44 sm:h-28 object-cover rounded-xl border"
                  />
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={uploading}
                className="bg-[#07c2e5] text-white px-4 py-3 rounded-xl w-full hover:bg-[#06a0bd] transition disabled:opacity-50 font-semibold"
              >
                {editId ? "💾 Enregistrer" : "🚀 Ajouter"}
              </button>
            </div>
          </div>
        </div>

        {/* LIST responsive */}
        <div className="mb-10">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 className="font-semibold text-base sm:text-lg text-gray-800">
              🧾 Produits enregistrés ({produits.length})
            </h2>
          </div>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 sm:hidden gap-4">
            {produits.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                Aucun produit enregistré pour le moment.
              </p>
            ) : (
              produits.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.dimensions}
                        className="w-20 h-20 object-cover rounded-xl border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl border bg-gray-50" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {p.dimensions || "—"}
                      </p>
                      <p className="text-sm text-[#07c2e5] font-bold mt-1">
                        {p.prix || "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: <span className="font-mono">{p.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 px-3 py-2 rounded-xl text-sm"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 border border-red-200 bg-white hover:bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table */}
          {produits.length > 0 && (
            <div className="hidden sm:block overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left p-3">Image</th>
                    <th className="text-left p-3">Dimensions</th>
                    <th className="text-left p-3">Prix</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {produits.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.dimensions}
                            className="h-12 w-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3 font-medium text-gray-900">
                        {p.dimensions || "—"}
                      </td>
                      <td className="p-3 text-[#07c2e5] font-semibold">
                        {p.prix || "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="text-[#07c2e5] hover:underline"
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:underline"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {produits.length === 0 && (
            <div className="hidden sm:block">
              <p className="text-gray-500 text-sm text-center">
                Aucun produit enregistré pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
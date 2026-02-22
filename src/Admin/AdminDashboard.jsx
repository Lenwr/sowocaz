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

  const [form, setForm] = useState({
    dimensions: "",
    image: "",
    prix: "",
  });

  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const produitsRef = useMemo(() => collection(db, "produits"), []);

  // ✅ Auth debug (tes rules exigent request.auth != null)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
      console.log(
        "AUTH STATE:",
        user ? `✅ ${user.uid} ${user.email || ""}` : "❌ null"
      );
    });
    return () => unsub();
  }, []);

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
      console.error("🔥 Storage upload failed:", err);
      alert(`❌ Storage: ${err?.code || ""} ${err?.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  // --- Ajouter / Modifier ---
  const handleSave = async () => {
    console.log("🟦 CLICK SAVE", { ...form, hasImage: !!form.image });

    if (!form.dimensions.trim() || !form.image.trim() || !form.prix.trim()) {
      alert("⚠️ Dimensions, image et prix sont obligatoires !");
      return;
    }

    // 🔥 obligatoire avec tes rules
    if (!auth.currentUser) {
      alert("❌ Tu n'es pas connecté Firebase Auth. Firestore va refuser.");
      console.log("AUTH currentUser = null (rules -> write denied)");
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

    // clean undefined
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    try {
      console.log("➡️ Firestore write start:", data);

      if (editId) {
        await updateDoc(doc(db, "produits", editId), data);
        setEditId(null);
        alert("✅ Produit mis à jour !");
      } else {
        const docRef = await addDoc(collection(db, "produits"), data);
        console.log("✅ Firestore doc created:", docRef.id);
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

  // --- Edit ---
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

  // --- Delete ---
  const handleDelete = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      try {
        await deleteDoc(doc(db, "produits", id));
        await fetchProduits();
      } catch (err) {
        console.error("🔥 Firestore delete failed:", err);
        alert(`❌ Firestore delete: ${err?.code || ""} ${err?.message || err}`);
      }
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

      <h1 className="text-3xl font-bold text-center text-[#0d0d1a] mb-6">
        Dashboard Sow Ocaz ⚙️
      </h1>

      {/* ✅ État auth (debug visible) */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm">
          <p className="text-gray-700">
            Auth Firebase :{" "}
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
          <p className="text-xs text-gray-500 mt-1">
            Tes rules Firestore demandent <code>request.auth != null</code> pour
            écrire.
          </p>
        </div>
      </div>

      {/* LISTE */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="font-semibold text-lg text-gray-800 mb-4">
          🧾 Produits enregistrés ({produits.length})
        </h2>

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
                          className="h-12 w-12 object-cover rounded-md border"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editId ? "✏️ Modifier un produit" : "➕ Ajouter un produit"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Dimensions */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Dimensions *
            </label>
            <input
              type="text"
              name="dimensions"
              value={form.dimensions}
              onChange={handleChange}
              placeholder='Ex : "85L/200H"'
              className="mt-1 border border-gray-300 rounded-md w-full p-2 text-gray-900"
            />
          </div>

          {/* Prix */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Prix *</label>
            <input
              type="text"
              name="prix"
              value={form.prix}
              onChange={handleChange}
              placeholder="Ex : 200 €"
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
              <p className="text-xs text-gray-500 mt-2">
                Upload en cours...
              </p>
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
            <button
              type="button"
              onClick={handleSave}
              disabled={uploading}
              className="bg-[#07c2e5] text-white px-4 py-2 rounded-md w-full hover:bg-[#06a0bd] transition disabled:opacity-50"
            >
              {editId ? "💾 Enregistrer" : "🚀 Ajouter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, storage, auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import AdminSidebar from "../Admin/AdminSidebar";
import DashboardTopbar from "../Admin/DashboardTopbar";
import DashboardStats from "../admin/DashboardStats";
import ProductForm from "../admin/ProductForm";
import ProductsSection from "../admin/ProductsSection";
import StockAlertsPanel from "../admin/StockAlertsPanel";
import StockHistorySection from "../admin/StockHistorySection";
import StockMovementModal from "../admin/StockMovementModal";

import { extractDims, getStockStatus } from "../utils/inventoryUtils";

const AdminDashboard = () => {
  const [produits, setProduits] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");

  const [form, setForm] = useState({
    dimensions: "",
    image: "",
    images: [],
    prix: "",
    description: "",
    stock: "0",
    stockMin: "1",
  });

  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [stockModalType, setStockModalType] = useState("entree");
  const [stockModalLoading, setStockModalLoading] = useState(false);

  const produitsRef = useMemo(() => collection(db, "produits"), []);
  const mouvementsRef = useMemo(() => collection(db, "mouvementsStock"), []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const fetchProduits = async () => {
    const snapshot = await getDocs(produitsRef);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    list.sort((a, b) => {
      const aStatus = getStockStatus(a.stock ?? 0, a.stockMin ?? 1);
      const bStatus = getStockStatus(b.stock ?? 0, b.stockMin ?? 1);

      const order = { rupture: 0, faible: 1, en_stock: 2 };
      if (order[aStatus] !== order[bStatus]) {
        return order[aStatus] - order[bStatus];
      }

      return (a.dimensions || "").localeCompare(b.dimensions || "");
    });

    setProduits(list);
  };

  const fetchMouvements = async () => {
    try {
      const qRef = query(mouvementsRef, orderBy("createdAt", "desc"), limit(10));
      const snapshot = await getDocs(qRef);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMouvements(list);
    } catch (err) {
      console.error("Erreur fetch mouvements:", err);
      setMouvements([]);
    }
  };

  useEffect(() => {
    fetchProduits();
    fetchMouvements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditId(null);
    setForm({
      dimensions: "",
      image: "",
      images: [],
      prix: "",
      description: "",
      stock: "0",
      stockMin: "1",
    });
    setPreview([]);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const localPreviews = files.map((file) => URL.createObjectURL(file));
    setPreview(localPreviews);

    const toastId = toast.loading("Upload des images...");

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const uniqueId = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`;

        const storageRef = ref(storage, `produits/${uniqueId}-${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }

      setForm((prev) => ({
        ...prev,
        image: uploadedUrls[0] || "",
        images: uploadedUrls,
      }));

      toast.success("Images uploadées avec succès !", { id: toastId });
    } catch (err) {
      console.error("🔥 Storage upload failed:", err);
      toast.error(`Storage: ${err?.code || ""} ${err?.message || err}`, {
        id: toastId,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = form.images.filter((_, index) => index !== indexToRemove);
    const updatedPreview = preview.filter((_, index) => index !== indexToRemove);

    setForm((prev) => ({
      ...prev,
      images: updatedImages,
      image: updatedImages[0] || "",
    }));

    setPreview(updatedPreview);
  };

  const handleSave = async () => {
    const currentImages =
      form.images?.length > 0
        ? form.images
        : form.image.trim()
          ? [form.image.trim()]
          : [];

    if (!form.dimensions.trim() || !currentImages.length || !form.prix.trim()) {
      toast.error("Dimensions, au moins une image et prix sont obligatoires !");
      return;
    }

    if (!auth.currentUser) {
      toast.error("Tu n'es pas connecté Firebase Auth.");
      return;
    }

    const dims = extractDims(form.dimensions.trim());
    const stockValue = Math.max(0, Number(form.stock) || 0);
    const stockMinValue = Math.max(0, Number(form.stockMin) || 0);
    const statutStock = getStockStatus(stockValue, stockMinValue);

    const data = {
      dimensions: form.dimensions.trim(),
      image: currentImages[0] || "",
      images: currentImages,
      prix: form.prix.trim(),
      description: form.description.trim(),
      stock: stockValue,
      stockMin: stockMinValue,
      statutStock,
      ...dims,
      createdAt: editId ? undefined : Date.now(),
      updatedAt: Date.now(),
    };

    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const toastId = toast.loading(editId ? "Mise à jour du produit..." : "Ajout du produit...");

    try {
      if (editId) {
        await updateDoc(doc(db, "produits", editId), data);
        toast.success("Produit mis à jour !", { id: toastId });
      } else {
        const created = await addDoc(collection(db, "produits"), data);

        if (stockValue > 0) {
          await addDoc(collection(db, "mouvementsStock"), {
            produitId: created.id,
            produitLabel: form.dimensions.trim(),
            type: "entree",
            quantite: stockValue,
            commentaire: "Stock initial",
            createdAt: Date.now(),
            createdBy: auth.currentUser?.uid || null,
            createdByEmail: auth.currentUser?.email || null,
            previousStock: 0,
            newStock: stockValue,
          });
        }

        toast.success("Produit ajouté !", { id: toastId });
      }

      resetForm();
      await fetchProduits();
      await fetchMouvements();
    } catch (err) {
      console.error("🔥 Firestore write failed:", err);
      toast.error(`Firestore: ${err?.code || ""} ${err?.message || err}`, {
        id: toastId,
      });
    }
  };

  const handleEdit = (p) => {
    const existingImages =
      Array.isArray(p.images) && p.images.length
        ? p.images
        : p.image
          ? [p.image]
          : [];

    setForm({
      dimensions: p.dimensions || "",
      image: existingImages[0] || "",
      images: existingImages,
      prix: p.prix || "",
      description: p.description || "",
      stock: String(p.stock ?? 0),
      stockMin: String(p.stockMin ?? 1),
    });

    setPreview(existingImages);
    setEditId(p.id);
    setActiveSection("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    const toastId = toast.loading("Suppression du produit...");

    try {
      await deleteDoc(doc(db, "produits", id));
      await fetchProduits();
      await fetchMouvements();
      toast.success("Produit supprimé", { id: toastId });
    } catch (err) {
      console.error("🔥 Firestore delete failed:", err);
      toast.error(`Firestore delete: ${err?.code || ""} ${err?.message || err}`, {
        id: toastId,
      });
    }
  };

  const handleOpenStockModal = (produit, type = "entree") => {
    setSelectedProduit(produit);
    setStockModalType(type);
    setStockModalOpen(true);
  };

  const handleCloseStockModal = () => {
    if (stockModalLoading) return;
    setStockModalOpen(false);
    setSelectedProduit(null);
    setStockModalType("entree");
  };

  const handleStockMovementConfirm = async ({ type, quantite, commentaire }) => {
    if (!selectedProduit) return;

    const qty = Number(quantite);

    if (!qty || qty <= 0) {
      toast.error("Quantité invalide");
      return;
    }

    setStockModalLoading(true);
    const toastId = toast.loading("Mise à jour du stock...");

    try {
      const refDoc = doc(db, "produits", selectedProduit.id);
      const snap = await getDoc(refDoc);

      if (!snap.exists()) {
        toast.error("Produit introuvable", { id: toastId });
        setStockModalLoading(false);
        return;
      }

      const produit = { id: snap.id, ...snap.data() };
      const currentStock = produit.stock ?? 0;

      let newStock = currentStock;

      if (type === "entree") {
        newStock = currentStock + qty;
      } else if (type === "sortie") {
        if (currentStock - qty < 0) {
          toast.error("Stock insuffisant", { id: toastId });
          setStockModalLoading(false);
          return;
        }
        newStock = currentStock - qty;
      } else if (type === "correction") {
        newStock = qty;
      }

      const newStatus = getStockStatus(newStock, produit.stockMin ?? 1);

      await updateDoc(refDoc, {
        stock: newStock,
        statutStock: newStatus,
        updatedAt: Date.now(),
      });

      await addDoc(collection(db, "mouvementsStock"), {
        produitId: produit.id,
        produitLabel: produit.dimensions || "",
        type,
        quantite: qty,
        commentaire:
          commentaire ||
          (type === "entree"
            ? "Réception stock"
            : type === "sortie"
              ? "Vente produit"
              : `Correction stock (${currentStock} → ${newStock})`),
        createdAt: Date.now(),
        createdBy: auth.currentUser?.uid || null,
        createdByEmail: auth.currentUser?.email || null,
        previousStock: currentStock,
        newStock,
      });

      await fetchProduits();
      await fetchMouvements();

      toast.success("Mouvement enregistré", { id: toastId });
      handleCloseStockModal();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour", { id: toastId });
    } finally {
      setStockModalLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("adminAuth");
    window.location.href = "/login";
  };

  const filteredProduits = useMemo(() => {
    return produits.filter((p) => {
      const status = getStockStatus(p.stock ?? 0, p.stockMin ?? 1);

      const matchesSearch =
        !search.trim() ||
        (p.dimensions || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.prix || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter = stockFilter === "all" ? true : status === stockFilter;
      return matchesSearch && matchesFilter;
    });
  }, [produits, search, stockFilter]);

  const stats = useMemo(() => {
    const totalProduits = produits.length;
    const totalStock = produits.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const ruptures = produits.filter(
      (p) => getStockStatus(p.stock ?? 0, p.stockMin ?? 1) === "rupture"
    ).length;
    const faibles = produits.filter(
      (p) => getStockStatus(p.stock ?? 0, p.stockMin ?? 1) === "faible"
    ).length;

    return { totalProduits, totalStock, ruptures, faibles };
  }, [produits]);

  const alertProducts = useMemo(() => {
    return produits.filter((p) => {
      const status = getStockStatus(p.stock ?? 0, p.stockMin ?? 1);
      return status === "rupture" || status === "faible";
    });
  }, [produits]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            background: "#0f172a",
            color: "#fff",
          },
        }}
      />

      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex min-h-screen">
          <AdminSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            stats={stats}
            handleLogout={handleLogout}
          />

          <main className="flex-1">
            <DashboardTopbar
              activeSection={activeSection}
              authReady={authReady}
              authUser={authUser}
              setActiveSection={setActiveSection}
            />

            <div className="px-4 py-6 sm:px-6">
              {(activeSection === "overview" || activeSection === "products") && (
                <div className="space-y-6">
                  <DashboardStats stats={stats} />

                  <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_1.3fr_0.9fr]">
                    <ProductForm
                      form={form}
                      setForm={setForm}
                      handleChange={handleChange}
                      handleFileUpload={handleFileUpload}
                      handleRemoveImage={handleRemoveImage}
                      handleSave={handleSave}
                      uploading={uploading}
                      preview={preview}
                      editId={editId}
                      resetForm={resetForm}
                    />

                    <ProductsSection
                      filteredProduits={filteredProduits}
                      search={search}
                      setSearch={setSearch}
                      stockFilter={stockFilter}
                      setStockFilter={setStockFilter}
                      handleOpenStockModal={handleOpenStockModal}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />

                    <div className="space-y-6">
                      <StockAlertsPanel alertProducts={alertProducts} />
                      <StockHistorySection
                        mouvements={mouvements}
                        compact
                        setActiveSection={setActiveSection}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "history" && (
                <StockHistorySection mouvements={mouvements} />
              )}
            </div>
          </main>
        </div>
      </div>

      <StockMovementModal
        isOpen={stockModalOpen}
        onClose={handleCloseStockModal}
        produit={selectedProduit}
        defaultType={stockModalType}
        onConfirm={handleStockMovementConfirm}
        loading={stockModalLoading}
      />
    </>
  );
};

export default AdminDashboard;
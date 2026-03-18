import React, { useEffect, useState } from "react";

const movementConfig = {
  entree: {
    title: "Entrée de stock",
    button: "Enregistrer l’entrée",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  sortie: {
    title: "Vente / sortie",
    button: "Enregistrer la sortie",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  correction: {
    title: "Correction de stock",
    button: "Enregistrer la correction",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const StockMovementModal = ({
  isOpen,
  onClose,
  produit,
  defaultType = "entree",
  onConfirm,
  loading = false,
}) => {
  const [type, setType] = useState(defaultType);
  const [quantite, setQuantite] = useState(1);
  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    if (isOpen) {
      setType(defaultType || "entree");
      setQuantite(1);
      setCommentaire("");
    }
  }, [isOpen, defaultType]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, loading]);

  if (!isOpen || !produit) return null;

  const config = movementConfig[type] || movementConfig.entree;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onConfirm({
      type,
      quantite: Number(quantite),
      commentaire: commentaire.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${config.badge}`}
            >
              {config.title}
            </div>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              {produit.dimensions || "Produit"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Stock actuel : <span className="font-semibold">{produit.stock ?? 0}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Type de mouvement
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={loading}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="entree">Entrée de stock</option>
              <option value="sortie">Vente / sortie</option>
              <option value="correction">Correction</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Quantité</label>
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              disabled={loading}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder="Ex : 2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Commentaire
            </label>
            <textarea
              rows={4}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              disabled={loading}
              placeholder={
                type === "entree"
                  ? "Ex : Réception fournisseur"
                  : type === "sortie"
                    ? "Ex : Vente client"
                    : "Ex : Ajustement après contrôle"
              }
              className="mt-1 w-full resize-none rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : config.button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementModal;
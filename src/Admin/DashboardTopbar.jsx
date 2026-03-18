import React from "react";

const DashboardTopbar = ({ activeSection, authReady, authUser, onAddProduct }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {activeSection === "overview" && "Vue d’ensemble"}
            {activeSection === "products" && "Gestion produits"}
            {activeSection === "history" && "Historique des mouvements"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Dashboard admin premium pour piloter l’inventaire
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
            {authReady ? (
              authUser ? (
                <span className="font-medium text-emerald-600">
                  ✅ {authUser.email || authUser.uid}
                </span>
              ) : (
                <span className="font-medium text-red-600">❌ non connecté</span>
              )
            ) : (
              <span className="text-slate-400">chargement…</span>
            )}
          </div>

          <button
            type="button"
            onClick={onAddProduct}
            className="rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            Ajouter un produit
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
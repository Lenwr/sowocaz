import React from "react";

const DashboardStats = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Produits</p>
        <p className="mt-3 text-3xl font-bold">{stats.totalProduits}</p>
        <p className="mt-1 text-xs text-slate-400">total catalogue enregistré</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Stock total</p>
        <p className="mt-3 text-3xl font-bold">{stats.totalStock}</p>
        <p className="mt-1 text-xs text-slate-400">unités disponibles</p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Stock faible</p>
        <p className="mt-3 text-3xl font-bold text-amber-600">{stats.faibles}</p>
        <p className="mt-1 text-xs text-slate-400">à surveiller rapidement</p>
      </div>

      <div className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Ruptures</p>
        <p className="mt-3 text-3xl font-bold text-red-600">{stats.ruptures}</p>
        <p className="mt-1 text-xs text-slate-400">indisponibles actuellement</p>
      </div>
    </section>
  );
};

export default DashboardStats;
import React from "react";

const menuItems = [
  { id: "overview", label: "Vue d’ensemble", icon: "📊" },
  { id: "products", label: "Produits", icon: "🪟" },
  { id: "history", label: "Mouvements", icon: "🧾" },
];

const AdminSidebar = ({ activeSection, setActiveSection, stats, onLogout }) => {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
          Sow Ocaz
        </p>
        <h1 className="mt-2 text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Gestion des produits, stocks et mouvements
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Alerte stock
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {stats.ruptures + stats.faibles}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            produit(s) à surveiller
          </p>
        </div>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <button
          onClick={onLogout}
          className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
import React from "react";
import { formatDate } from "../utils/inventoryUtils";

const StockHistorySection = ({
  mouvements,
  compact = false,
  setActiveSection,
}) => {
  if (compact) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold">Derniers mouvements</h3>
        <p className="mt-1 text-sm text-slate-500">
          Réceptions et ventes récentes
        </p>

        <div className="mt-4 space-y-3">
          {mouvements.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
              Aucun mouvement enregistré.
            </div>
          ) : (
            mouvements.slice(0, 6).map((m) => {
              const isEntry = m.type === "entree";
              const isExit = m.type === "sortie";

              return (
                <div
                  key={m.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {m.produitLabel || "Produit"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(m.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isEntry
                          ? "bg-emerald-100 text-emerald-700"
                          : isExit
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isEntry ? "Entrée" : isExit ? "Vente" : m.type}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Quantité</span>
                    <span className="font-bold text-slate-900">
                      {m.quantite ?? 0}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {setActiveSection && (
          <button
            type="button"
            onClick={() => setActiveSection("history")}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Voir tout l’historique
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Historique complet</h3>
        <p className="text-sm text-slate-500">
          Toutes les dernières opérations de stock
        </p>
      </div>

      <div className="space-y-4">
        {mouvements.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Aucun mouvement enregistré.
          </div>
        ) : (
          mouvements.map((m) => {
            const isEntry = m.type === "entree";
            const isExit = m.type === "sortie";

            return (
              <div
                key={m.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {m.produitLabel || "Produit"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(m.createdAt)}
                    </p>
                    {m.createdByEmail ? (
                      <p className="mt-1 text-xs text-slate-400">
                        par {m.createdByEmail}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        isEntry
                          ? "bg-emerald-100 text-emerald-700"
                          : isExit
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isEntry ? "Entrée stock" : isExit ? "Vente" : m.type}
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                      x{m.quantite ?? 0}
                    </span>
                  </div>
                </div>

                {m.commentaire ? (
                  <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                    {m.commentaire}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default StockHistorySection;
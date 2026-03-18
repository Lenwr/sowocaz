import React from "react";
import {
  getStockStatus,
  stockBadgeClasses,
  stockLabel,
} from "../utils/inventoryUtils";

const StockAlertsPanel = ({ alertProducts }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">Alertes stock</h3>
      <p className="mt-1 text-sm text-slate-500">
        Produits à surveiller en priorité
      </p>

      <div className="mt-4 space-y-3">
        {alertProducts.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
            Aucun produit critique pour le moment.
          </div>
        ) : (
          alertProducts.slice(0, 6).map((p) => {
            const status = getStockStatus(p.stock ?? 0, p.stockMin ?? 1);

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {p.dimensions || "Produit"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      stock: {p.stock ?? 0} • seuil: {p.stockMin ?? 0}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${stockBadgeClasses[status]}`}
                  >
                    {stockLabel[status]}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StockAlertsPanel;
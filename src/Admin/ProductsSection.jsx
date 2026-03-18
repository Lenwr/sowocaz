import React, { useEffect, useMemo, useState } from "react";
import {
  getStockStatus,
  stockBadgeClasses,
  stockLabel,
} from "../utils/inventoryUtils";

const ProductsSection = ({
  filteredProduits,
  search,
  setSearch,
  stockFilter,
  setStockFilter,
  handleOpenStockModal,
  handleEdit,
  handleDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = filteredProduits.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const paginatedProduits = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProduits.slice(start, start + itemsPerPage);
  }, [filteredProduits, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stockFilter, filteredProduits.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Catalogue produits</h3>
          <p className="text-sm text-slate-500">
            Recherche, stock et actions rapides
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">Tous les stocks</option>
            <option value="en_stock">En stock</option>
            <option value="faible">Stock faible</option>
            <option value="rupture">Rupture</option>
          </select>
        </div>
      </div>

      <div className="hidden xl:block">
        {filteredProduits.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="max-h-[650px] overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-3 font-medium">Produit</th>
                  <th className="px-3 py-3 font-medium">Prix</th>
                  <th className="px-3 py-3 font-medium">Stock</th>
                  <th className="px-3 py-3 font-medium">Mouvement</th>
                  <th className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProduits.map((p) => {
                  const productImages =
                    Array.isArray(p.images) && p.images.length
                      ? p.images
                      : p.image
                        ? [p.image]
                        : [];

                  const status = getStockStatus(p.stock ?? 0, p.stockMin ?? 1);

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 align-middle hover:bg-slate-50"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {productImages[0] ? (
                            <img
                              src={productImages[0]}
                              alt={p.dimensions}
                              className="h-14 w-14 rounded-2xl border border-slate-200 object-cover bg-white"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-white" />
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {p.dimensions || "—"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {p.description || "Pas de description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 font-semibold text-cyan-600">
                        {p.prix || "—"}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-slate-900">
                              {p.stock ?? 0}
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${stockBadgeClasses[status]}`}
                            >
                              {stockLabel[status]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            seuil: {p.stockMin ?? 0}
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenStockModal(p, "entree")}
                            className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
                          >
                            + Entrée
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenStockModal(p, "sortie")}
                            className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                          >
                            - Vente
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenStockModal(p, "correction")}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Correction
                          </button>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Supprimer
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

      <div className="grid grid-cols-1 gap-4 xl:hidden">
        {filteredProduits.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Aucun produit trouvé.
          </div>
        ) : (
          paginatedProduits.map((p) => {
            const productImages =
              Array.isArray(p.images) && p.images.length
                ? p.images
                : p.image
                  ? [p.image]
                  : [];

            const status = getStockStatus(p.stock ?? 0, p.stockMin ?? 1);

            return (
              <div
                key={p.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex gap-3">
                  {productImages[0] ? (
                    <img
                      src={productImages[0]}
                      alt={p.dimensions}
                      className="h-20 w-20 rounded-2xl border border-slate-200 object-cover bg-white"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl border border-slate-200 bg-white" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {p.dimensions || "—"}
                      </p>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${stockBadgeClasses[status]}`}
                      >
                        {stockLabel[status]}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-bold text-cyan-600">
                      {p.prix || "—"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Stock: {p.stock ?? 0} • Seuil: {p.stockMin ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => handleOpenStockModal(p, "entree")}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                  >
                    + Entrée
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenStockModal(p, "sortie")}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                  >
                    - Vente
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenStockModal(p, "correction")}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Correction
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(p)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredProduits.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Affichage de{" "}
            <span className="font-medium text-slate-700">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            à{" "}
            <span className="font-medium text-slate-700">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            sur{" "}
            <span className="font-medium text-slate-700">{totalItems}</span>{" "}
            produit(s)
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Précédent
            </button>

            <span className="px-2 text-sm text-slate-600">
              Page {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
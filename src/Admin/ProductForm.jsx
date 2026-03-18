import React from "react";

const ProductForm = ({
  form,
  setForm,
  handleChange,
  handleFileUpload,
  handleRemoveImage,
  handleSave,
  uploading,
  preview,
  editId,
  resetForm,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {editId ? "Modifier un produit" : "Ajouter un produit"}
          </h3>
          <p className="text-sm text-slate-500">
            Dimensions, prix et image obligatoire
          </p>
        </div>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Dimensions *</label>
          <input
            type="text"
            name="dimensions"
            value={form.dimensions}
            onChange={handleChange}
            placeholder='Ex : "85L/200H"'
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Prix *</label>
          <input
            type="text"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            placeholder="Ex : 200 €"
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Stock initial
            </label>
            <input
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Seuil alerte
            </label>
            <input
              type="number"
              min="0"
              name="stockMin"
              value={form.stockMin}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Ex : ouvrant droit"
            className="mt-1 w-full resize-none rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Images *</p>
              <p className="text-xs text-slate-500">
                Upload multiple via Firebase Storage
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="text-sm text-slate-900"
            />

            {uploading && (
              <p className="text-xs text-slate-500">Upload en cours...</p>
            )}

            {(preview.length > 0 || form.images.length > 0 || form.image) && (
              <div className="grid grid-cols-2 gap-3">
                {(preview.length > 0
                  ? preview
                  : form.images.length > 0
                    ? form.images
                    : form.image
                      ? [form.image]
                      : []
                ).map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <img
                      src={src}
                      alt={`aperçu ${index + 1}`}
                      className="h-28 w-full object-contain bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-2 top-2 rounded-lg bg-black/75 px-2 py-1 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              name="image"
              placeholder="URL image principale (optionnel)"
              value={form.image}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.value,
                  images:
                    prev.images.length > 0
                      ? prev.images
                      : e.target.value.trim()
                        ? [e.target.value.trim()]
                        : [],
                }))
              }
              className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={uploading}
          className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editId ? "Enregistrer" : "Ajouter le produit"}
        </button>
      </div>
    </section>
  );
};

export default ProductForm;
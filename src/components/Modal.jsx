import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ product, onClose, onSaveDescription, saving = false }) => {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (product) {
      setDescription(product.description || "");
    }
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center cursor-pointer"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-11/12 max-w-lg p-6 cursor-default max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h2 className="text-[#07c2e5] font-bold text-xl text-center mb-4">
              {product.nom}
            </h2>

            <div className="flex overflow-x-auto gap-3 pb-2">
              {product.images?.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.nom} image ${i + 1}`}
                  className="h-64 w-48 rounded-xl object-cover flex-shrink-0"
                />
              ))}
            </div>

            {product.dimensions ? (
              <p className="text-sm text-gray-500 mt-4">
                <span className="font-semibold">Dimensions :</span> {product.dimensions}
              </p>
            ) : null}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du produit
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex : ouvrant droit"
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#07c2e5] resize-none"
              />
            </div>

            <span className="block mt-3 text-[#07c2e5] font-bold text-lg">
              {product.prix || "—"}
            </span>

            <div className="flex justify-between mt-5 gap-2 flex-wrap">
              <a href="tel:0781701384">
                <button className="bg-gray-100 text-black px-4 py-2 rounded-lg hover:scale-105 transition">
                  Appeler
                </button>
              </a>

              <a
                href="https://wa.me/33781701384"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-[#07c2e5] text-white px-4 py-2 rounded-lg hover:bg-[#06a0bd] transition">
                  WhatsApp
                </button>
              </a>

              <button
                onClick={() => onSaveDescription(product.id, description)}
                disabled={saving}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>

              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
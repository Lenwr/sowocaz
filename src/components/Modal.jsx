import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ product, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);

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
            className="bg-white rounded-2xl shadow-xl w-11/12 max-w-2xl p-6 cursor-default"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h2 className="text-[#07c2e5] font-bold text-xl text-center mb-4">
              {product.nom}
            </h2>

            {/* Image principale */}
            <div className="w-full rounded-xl overflow-hidden border mb-3">
              <img
                src={product.images?.[activeImage]}
                alt={product.nom}
                className="w-full h-96 object-contain bg-white"
              />
            </div>

            {/* Miniatures */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-16 rounded-lg object-cover cursor-pointer border ${
                      activeImage === i
                        ? "border-[#07c2e5]"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-700 mt-4 text-sm">
                {product.description}
              </p>
            )}

            {/* Prix */}
            <span className="block mt-3 text-[#07c2e5] font-bold text-lg">
              {product.prix}
            </span>

            {/* Actions */}
            <div className="flex justify-between mt-5">
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
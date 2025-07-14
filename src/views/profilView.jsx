import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => (
  <div className="bg-gradient-to-b from-[#0d0d1a] to-[#13132b] h-32 relative">
    <div className="absolute inset-x-0 top-16 flex justify-center">
      <img
        className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-md"
        src="/soLogo.png"
        alt="Avatar"
      />
    </div>
  </div>
);

const TagList = ({ tags, onSelect }) => (
  <div className="flex justify-center flex-wrap gap-3 mt-4">
    {tags.map((tag) => (
      <span
        key={tag.nom}
        onClick={() => onSelect(tag)}
        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs cursor-pointer hover:bg-gray-200 transition"
      >
        {tag.nom}
      </span>
    ))}
  </div>
);

const Modal = ({ selected, onClose }) => (
  <AnimatePresence>
    {selected && (
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-4 w-11/12 max-w-md max-h-[80%] overflow-y-auto"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <h3 className="font-bold text-[#07c2e5] text-lg mb-4 text-center">
            {selected.nom}
          </h3>

          {selected.imageUrls ? (
            <div className="flex overflow-x-auto gap-4">
              {selected.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Image ${index}`}
                  className="h-72 w-48 rounded-lg flex-shrink-0 object-cover"
                />
              ))}
            </div>
          ) : (
            <img
              src={selected.imageUrl || "/soLogo.png"}
              alt="Image du modèle"
              className="h-72 w-48 mx-auto rounded-lg object-cover"
            />
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full bg-[#07c2e5] text-white py-2 rounded-lg hover:bg-[#06a0bd] transition"
          >
            Fermer
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Profil = () => {
  const tagsData = [
    { nom: "46L/90H", imageUrl: "/46L90HF.jpeg" },
    {
      nom: "85L/200H",
      imageUrls: [
        "/85L200HF.jpeg",
        "/85L200HFBLANC.jpeg",
        "/85L200HFOD.jpeg",
        "/85L200HFOG.jpeg",
      ],
    },
    { nom: "96L/92H", imageUrl: "/96L92HF.jpeg" },
    { nom: "100L/130H", imageUrl: "/100L130H.jpeg" },
    {
      nom: "100L/215H",
      imageUrls: [
        "/100L215HBLANC.jpeg",
        "/100L215HGRIS.jpeg",
        "/100L215HMARRON.jpeg",
        "/100L215HNOIR.jpeg",
        "/100L215HNOIR2.jpeg",
        "/100L215HNOIR3.jpeg",
      ],
    },
    { nom: "106L/162H", imageUrl: "/106L162HF.jpeg" },
    { nom: "115L/112H", imageUrl: "/115L112HF.jpeg" },
    { nom: "130L/130H", imageUrl: "/130L130HF.jpeg" },
    { nom: "130L/205H", imageUrl: "/130L205HF.jpeg" },
    { nom: "130L/206H", imageUrl: "/130L206HF.jpeg" },
    {
      nom: "130L/215H",
      imageUrls: ["/130L215HMARRON.jpeg", "/130L215HNOIR.jpeg"],
    },
    { nom: "140L/164H", imageUrl: "/140L164HF.jpeg" },
    { nom: "183L/128H", imageUrl: "/183L128HF.jpeg" },
    { nom: "186L/140H", imageUrl: "/186L140HF.jpeg" },
    {
      nom: "190L/205H",
      imageUrls: [
        "/190L205HF.jpeg",
        "/190L205HF2.jpeg",
        "/190L205HF3.jpeg",
      ],
    },
    { nom: "212L/164H", imageUrl: "/212L164HF.jpeg" },
    { nom: "300L/140H", imageUrl: "/300L140HF.jpeg" },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div className="m-2 min-h-screen bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <Header />

      <div className="pt-20 pb-4 text-center px-4">
        <h2 className="text-xl font-semibold text-gray-800">Sow Ocaz</h2>
        <h1 className="text-[#07c2e5] font-bold text-lg">07 81 70 13 84</h1>

        <div className="flex justify-center gap-2 mt-4">
          <a href="tel:0781701384">
            <button className="px-4 py-2 bg-gray-100 text-black rounded-full text-sm hover:scale-105 transition-transform">
              Appeler
            </button>
          </a>
          <a
            href="https://wa.me/33781701384"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-4 py-2 bg-gray-100 text-black rounded-full text-sm hover:scale-105 transition-transform">
              Envoyer un message
            </button>
          </a>
        </div>

        <p className="my-4 text-sm text-gray-700">
          Vente de fenêtres et portes-fenêtres en PVC avec possibilité de pose 📥
        </p>
      </div>

      <div className="px-4 pt-8 border-t text-sm text-gray-700">
        <h3 className="font-semibold text-base mb-3">Information</h3>
        <div className="mb-2">
          <span className="font-medium">
            🌐 Transport en Ile-de-France et envoi vers l'Afrique de l'Ouest :
          </span>{" "}
          <a
            href="https://www.wefretafrica.com/"
            className="text-[#07c2e5] underline"
            target="_blank"
            rel="noreferrer"
          >
            Cliquer ici
          </a>
        </div>
        <div className="mb-2">
          <span className="font-medium">📧 Email:</span>{" "}
          <a href="mailto:bohoumecoly@hotmail.fr" className="text-[#07c2e5] underline">
            Envoyer un mail
          </a>
        </div>
        <div className="mb-2">
          <span className="font-medium">📞 Téléphone:</span> 07 81 70 13 84
        </div>

        <h3 className="font-semibold text-base my-4">
          Cliquez sur la dimension :
        </h3>

        <TagList tags={tagsData} onSelect={setSelected} />
      </div>

      <Modal selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Profil;

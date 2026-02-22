import React, { useState } from "react";
import Header from "../components/Header";
import Modal from "../components/Modal";

const ProductCard = ({ nom, images, description, prix, onSelect }) => (
  <div
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 cursor-pointer flex flex-col"
    onClick={() => onSelect({ nom, images, description, prix })}
  >
    <img
      src={images[0]}
      alt={nom}
      className="h-48 w-full object-cover rounded-xl"
      loading="lazy"
    />
    <h3 className="font-semibold text-gray-800 mt-3 text-lg">{nom}</h3>
    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
    <span className="text-[#07c2e5] font-bold mt-2">{prix}</span>
  </div>
);

const ProductView = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const produits = [
    { nom: "46L/90H", images: ["/46L90HF.jpeg"] },
    {
      nom: "85L/200H",
      images: [
        "/85L200HF.jpeg",
        "/85L200HFBLANC.jpeg",
        "/85L200HFOD.jpeg",
        "/85L200HFOG.jpeg",
      ],
    },
    { nom: "96L/92H", images: ["/96L92HF.jpeg"] },
    { nom: "100L/130H", images: ["/100L130H.jpeg"] },
    {
      nom: "100L/215H",
      images: [
        "/100L215HBLANC.jpeg",
        "/100L215HGRIS.jpeg",
        "/100L215HMARRON.jpeg",
        "/100L215HNOIR.jpeg",
        "/100L215HNOIR2.jpeg",
        "/100L215HNOIR3.jpeg",
      ],
    },
    { nom: "106L/162H", images: ["/106L162HF.jpeg"] },
    { nom: "115L/112H", images: ["/115L112HF.jpeg"] },
    { nom: "130L/130H", images: ["/130L130HF.jpeg"] },
    { nom: "130L/205H", images: ["/130L205HF.jpeg"] },
    { nom: "130L/206H", images: ["/130L206HF.jpeg"] },
    {
      nom: "130L/215H",
      images: ["/130L215HMARRON.jpeg", "/130L215HNOIR.jpeg"],
    },
    { nom: "140L/164H", images: ["/140L164HF.jpeg"] },
    { nom: "183L/128H", images: ["/183L128HF.jpeg"] },
    { nom: "186L/140H", images: ["/186L140HF.jpeg"] },
    {
      nom: "190L/205H",
      images: [
        "/190L205HF.jpeg",
        "/190L205HF2.jpeg",
        "/190L205HF3.jpeg",
      ],
    },
    { nom: "212L/164H", images: ["/212L164HF.jpeg"] },
    { nom: "300L/140H", images: ["/300L140HF.jpeg"] },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Nos produits disponibles
        </h2>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produits.map((p, i) => (
            <ProductCard key={i} {...p} onSelect={setSelectedProduct} />
          ))}
        </section>
      </main>

      <footer className="bg-[#13132b] text-gray-300 text-sm py-6 mt-8">
        <div className="container mx-auto text-center space-y-2">
          <p>
            📞 07 81 70 13 84 —{" "}
            <a
              href="mailto:bohoumecoly@hotmail.fr"
              className="text-[#07c2e5] underline"
            >
              bohoumecoly@hotmail.fr
            </a>
          </p>
          <p>
            🌐{" "}
            <a
              href="https://www.wefretafrica.com/"
              target="_blank"
              rel="noreferrer"
              className="underline text-[#07c2e5]"
            >
              Transport vers l’Afrique de l’Ouest
            </a>
          </p>
          <p>© {new Date().getFullYear()} Sow Ocaz. Tous droits réservés ASA.</p>
        </div>
      </footer>

      <Modal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductView;

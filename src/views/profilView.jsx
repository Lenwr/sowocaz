import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Modal from "../components/Modal";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ProductCard = ({ nom, images, prix, dimensions, onSelect }) => (
  <div
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 cursor-pointer flex flex-col"
    onClick={() => onSelect({ nom, images, prix, dimensions })}
  >
    <img
      src={images?.[0]}
      alt={nom}
      className="h-48 w-full object-cover rounded-xl"
      loading="lazy"
    />

    <h3 className="font-semibold text-gray-800 mt-3 text-lg">{nom}</h3>

    {dimensions ? (
      <p className="text-xs text-gray-500 mt-1">📏 {dimensions}</p>
    ) : null}

    <span className="text-[#07c2e5] font-bold mt-2">{prix || "—"}</span>
  </div>
);

/** Normalise (Firestore + local) -> front */
function normalizeProduit(p) {
  const images =
    Array.isArray(p.images) && p.images.length
      ? p.images
      : p.image
        ? [p.image]
        : [];

  // fallback si "nom" pas là : on utilise dimensions
  const nom = (p.nom ?? p.dimensions ?? "Produit").toString();

  return {
    id: p.id ?? `${nom}-${images[0] ?? Math.random()}`,
    nom,
    images,
    prix: p.prix ?? "",
    dimensions: p.dimensions ?? "",
    // champs numériques si dispo (créés par AdminDashboard)
    largeur: typeof p.largeur === "number" ? p.largeur : null,
    hauteur: typeof p.hauteur === "number" ? p.hauteur : null,
    profondeur: typeof p.profondeur === "number" ? p.profondeur : null,
    volume: typeof p.volume === "number" ? p.volume : null,
  };
}

/**
 * Parse dimensions (si pas de champs numériques en base)
 * Supporte:
 * - "85L/200H"
 * - "L 30 x l 20 x H 10 cm"
 * - "30x20x10"
 */
function parseDims(str) {
  if (!str) return { w: null, h: null, d: null, volume: null };

  const s = String(str).replace(",", ".").toLowerCase().trim();

  // cas "85L/200H"
  const m1 = s.match(/(\d+(?:\.\d+)?)\s*l\s*\/\s*(\d+(?:\.\d+)?)\s*h/);
  if (m1) {
    const w = Number(m1[1]);
    const h = Number(m1[2]);
    return { w, h, d: null, volume: null };
  }

  // cas "l 30 x l 20 x h 10"
  const hasLetters = /[ldh]/.test(s);
  if (hasLetters) {
    const wMatch = s.match(/(?:^|[\s/])l\s*[:=]?\s*(\d+(?:\.\d+)?)/);
    const dMatch = s.match(/(?:^|[\s/])d\s*[:=]?\s*(\d+(?:\.\d+)?)/);
    const hMatch = s.match(/(?:^|[\s/])h\s*[:=]?\s*(\d+(?:\.\d+)?)/);

    const w = wMatch ? Number(wMatch[1]) : null;
    const d = dMatch ? Number(dMatch[1]) : null;
    const h = hMatch ? Number(hMatch[1]) : null;

    const volume = w && h && d ? w * h * d : null;
    return { w, h, d, volume };
  }

  // fallback 3 nombres
  const nums = s.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const w = nums[0] ?? null;
  const d = nums[1] ?? null;
  const h = nums[2] ?? null;
  const volume = w && h && d ? w * h * d : null;
  return { w, h, d, volume };
}

const ProductView = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dbProduits, setDbProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ produits en dur
  const localProduits = useMemo(
    () => [
      { nom: "46L/90H", images: ["/46L90HF.jpeg"], dimensions: "46L/90H" },
      {
        nom: "85L/200H",
        images: ["/85L200HF.jpeg", "/85L200HFBLANC.jpeg", "/85L200HFOD.jpeg", "/85L200HFOG.jpeg"],
        dimensions: "85L/200H",
      },
      { nom: "96L/92H", images: ["/96L92HF.jpeg"], dimensions: "96L/92H" },
      { nom: "100L/130H", images: ["/100L130H.jpeg"], dimensions: "100L/130H" },
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
        dimensions: "100L/215H",
      },
      { nom: "106L/162H", images: ["/106L162HF.jpeg"], dimensions: "106L/162H" },
      { nom: "115L/112H", images: ["/115L112HF.jpeg"], dimensions: "115L/112H" },
      { nom: "130L/130H", images: ["/130L130HF.jpeg"], dimensions: "130L/130H" },
      { nom: "130L/205H", images: ["/130L205HF.jpeg"], dimensions: "130L/205H" },
      { nom: "130L/206H", images: ["/130L206HF.jpeg"], dimensions: "130L/206H" },
      {
        nom: "130L/215H",
        images: ["/130L215HMARRON.jpeg", "/130L215HNOIR.jpeg"],
        dimensions: "130L/215H",
      },
      { nom: "140L/164H", images: ["/140L164HF.jpeg"], dimensions: "140L/164H" },
      { nom: "183L/128H", images: ["/183L128HF.jpeg"], dimensions: "183L/128H" },
      { nom: "186L/140H", images: ["/186L140HF.jpeg"], dimensions: "186L/140H" },
      {
        nom: "190L/205H",
        images: ["/190L205HF.jpeg", "/190L205HF2.jpeg", "/190L205HF3.jpeg"],
        dimensions: "190L/205H",
      },
      { nom: "212L/164H", images: ["/212L164HF.jpeg"], dimensions: "212L/164H" },
      { nom: "300L/140H", images: ["/300L140HF.jpeg"], dimensions: "300L/140H" },
    ],
    []
  );

  // ✅ Firestore
  useEffect(() => {
    const run = async () => {
      try {
        const snap = await getDocs(collection(db, "produits"));
        const list = snap.docs.map((d) => normalizeProduit({ id: d.id, ...d.data() }));
        setDbProduits(list);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // ✅ merge (local + db) + dédup
  const allProduits = useMemo(() => {
    const normalizedLocal = localProduits.map(normalizeProduit);
    const map = new Map();

    [...normalizedLocal, ...dbProduits].forEach((p) => {
      const key = `${p.nom}-${p.images?.[0] ?? ""}`;
      if (!map.has(key)) map.set(key, p);
    });

    return Array.from(map.values());
  }, [localProduits, dbProduits]);

  // ✅ tri
  const [sortKey, setSortKey] = useState("none"); // none | wAsc | wDesc | hAsc | hDesc | volumeAsc | volumeDesc

  const produitsAffiches = useMemo(() => {
    const arr = [...allProduits];
    if (sortKey === "none") return arr;

    const asc = sortKey.endsWith("Asc");

    const getDims = (p) => {
      // priorité aux champs numériques (propre)
      const w = typeof p.largeur === "number" ? p.largeur : null;
      const h = typeof p.hauteur === "number" ? p.hauteur : null;
      const d = typeof p.profondeur === "number" ? p.profondeur : null;
      const v = typeof p.volume === "number" ? p.volume : null;

      if (w !== null || h !== null || d !== null || v !== null) return { w, h, d, volume: v };

      // fallback parsing string
      return parseDims(p.dimensions || p.nom);
    };

    const getVal = (p) => {
      const dims = getDims(p);
      if (sortKey.startsWith("w")) return dims.w ?? Number.POSITIVE_INFINITY;
      if (sortKey.startsWith("h")) return dims.h ?? Number.POSITIVE_INFINITY;
      if (sortKey.startsWith("volume")) return dims.volume ?? Number.POSITIVE_INFINITY;
      return 0;
    };

    arr.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      if (va === vb) return 0;
      return asc ? va - vb : vb - va;
    });

    return arr;
  }, [allProduits, sortKey]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-10">
        <div className="flex flex-col gap-3 items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Nos produits disponibles</h2>

          <div className="flex gap-2 flex-wrap justify-center text-black items-center">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="none">Trier : aucun</option>
              <option value="wAsc">Largeur ↑</option>
              <option value="wDesc">Largeur ↓</option>
              <option value="hAsc">Hauteur ↑</option>
              <option value="hDesc">Hauteur ↓</option>
              <option value="volumeAsc">Volume ↑</option>
              <option value="volumeDesc">Volume ↓</option>
            </select>

            <span className="text-sm text-gray-500">
              {loading ? "Chargement..." : `${produitsAffiches.length} produit(s)`}
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Chargement des produits…</p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produitsAffiches.map((p) => (
              <ProductCard key={p.id} {...p} onSelect={setSelectedProduct} />
            ))}
          </section>
        )}
      </main>

      <footer className="bg-[#13132b] text-gray-300 text-sm py-6 mt-8">
        <div className="container mx-auto text-center space-y-2">
          <p>
            📞 07 81 70 13 84 —{" "}
            <a href="mailto:bohoumecoly@hotmail.fr" className="text-[#07c2e5] underline">
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
          <p>© {new Date().getFullYear()} Sow Ocaz. Tous droits réservés ASA.</p>
        </div>
      </footer>

      <Modal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default ProductView;
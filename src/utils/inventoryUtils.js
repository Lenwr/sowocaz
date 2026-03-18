export const extractDims = (dimensions) => {
    if (!dimensions) {
      return { largeur: null, hauteur: null, profondeur: null, volume: null };
    }
  
    const s = String(dimensions).replace(",", ".").toLowerCase().trim();
  
    const m1 = s.match(/(\d+(?:\.\d+)?)\s*l\s*\/\s*(\d+(?:\.\d+)?)\s*h/);
    if (m1) {
      const largeur = Number(m1[1]);
      const hauteur = Number(m1[2]);
      return { largeur, hauteur, profondeur: null, volume: null };
    }
  
    const hasLetters = /[ldh]/.test(s);
    if (hasLetters) {
      const wMatch = s.match(/(?:^|[\s/])l\s*[:=]?\s*(\d+(?:\.\d+)?)/);
      const dMatch = s.match(/(?:^|[\s/])d\s*[:=]?\s*(\d+(?:\.\d+)?)/);
      const hMatch = s.match(/(?:^|[\s/])h\s*[:=]?\s*(\d+(?:\.\d+)?)/);
  
      const largeur = wMatch ? Number(wMatch[1]) : null;
      const profondeur = dMatch ? Number(dMatch[1]) : null;
      const hauteur = hMatch ? Number(hMatch[1]) : null;
  
      const volume =
        largeur && hauteur && profondeur ? largeur * hauteur * profondeur : null;
  
      return { largeur, hauteur, profondeur, volume };
    }
  
    const nums = s.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    const largeur = nums[0] ?? null;
    const profondeur = nums[1] ?? null;
    const hauteur = nums[2] ?? null;
    const volume =
      largeur && hauteur && profondeur ? largeur * hauteur * profondeur : null;
  
    return { largeur, hauteur, profondeur, volume };
  };
  
  export const getStockStatus = (stock = 0, stockMin = 1) => {
    if (stock <= 0) return "rupture";
    if (stock <= stockMin) return "faible";
    return "en_stock";
  };
  
  export const stockLabel = {
    en_stock: "En stock",
    faible: "Faible",
    rupture: "Rupture",
  };
  
  export const stockBadgeClasses = {
    en_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
    faible: "bg-amber-50 text-amber-700 border-amber-200",
    rupture: "bg-red-50 text-red-700 border-red-200",
  };
  
  export const formatDate = (ts) => {
    if (!ts) return "—";
    try {
      return new Date(ts).toLocaleString("fr-FR");
    } catch {
      return "—";
    }
  };
  
  export const menuItems = [
    { id: "overview", label: "Vue d’ensemble", icon: "📊" },
    { id: "products", label: "Produits", icon: "🪟" },
    { id: "history", label: "Mouvements", icon: "🧾" },
  ];
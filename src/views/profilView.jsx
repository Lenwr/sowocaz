import React from "react";

const Profil = () => {
  return (
    <div className=" m-2 h-screen bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d0d1a] to-[#13132b] h-32 relative">
        <div className="absolute inset-x-0 top-16 flex justify-center">
            {/* Avatar Emoji */}
            <img className="w-32 h-32 rounded-full shadow-md " src="/soLogo.png" alt="" />
        </div>
      </div>

      {/* Main Info */}
      <div className="pt-16 pb-4 text-center px-4">
        <h1 className="text-xl font-semibold text-gray-800">Sow Ocaz</h1>
        <p className="text-sm text-blue-600"></p>
        <p className="text-sm text-gray-500 mt-1">Bandung | Joined March 2023</p>

        {/* Buttons */}
        <div className="flex justify-center gap-2 mt-4">
        <a href="tel:0781701384" className="inline-block">
  <button className="px-4 py-1 bg-gray-100 rounded-full text-sm">
    Appeler
  </button>
</a>
<a
  href="https://wa.me/33781701384"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block"
>
  <button className="px-4 py-1 bg-gray-100 rounded-full text-sm">
    Envoyer un message
  </button>
</a>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-gray-700">
        Vente de fenêtres et portes-fenêtres en pvc avec possibilité de faire la pose 📥
        </p>
      </div>

      {/* Information Section */}
      <div className="px-6 py-4 border-t text-sm text-gray-700">
        <h3 className="font-semibold text-base mb-3">Information</h3>
        <div className="mb-2">
          <span className="font-medium">🌐 Envoi || transport || deménagement :</span>{" "}
          <a href="https://www.wefretafrica.fr/" className="text-[#07c2e5]" target="_blank" rel="noreferrer">
            wefretafrica
          </a>
        </div>
        <div className="mb-2">
          <span className="font-medium">📧 Email:</span>{" "}
          <a href="mailto:Hello@adalahreza.com" className="text-[#07c2e5]">
            Email de sow
          </a>
        </div>
        <div className="mb-2">
          <span className="font-medium">📞 Phone:</span> 07 81 70 13 84
        </div>
        <div className="mb-2">
          <span className="font-medium"></span> 
        </div>

        {/* Tags */}
        <h3 className="font-semibold text-base mb-3">Liste des dimensions</h3>
        <div className="flex justify-around flex-wrap gap-4 mt-4">
          {["140L/164H","212L/164H","100L/215H","130L/215H","300L/140H","190L/205H","90L/125H","183L/128H","186L/140H",
            "96L/92H","106L/162H","85L/200H","46L/90H","115L/112H","120L/120H"
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profil;

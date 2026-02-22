import React from "react";

const Header = () => (
  <header className="bg-gradient-to-r from-[#0d0d1a] to-[#13132b] py-6 shadow-md">
    <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-6 text-white">
      <div className="flex items-center gap-3">
        <img
          src="/soLogo.png"
          alt="Sow Ocaz"
          className="w-14 h-14 rounded-full shadow-lg"
        />
        <h1 className="text-xl font-bold">Sow Ocaz</h1>
      </div>

      <div className="flex gap-2 mt-4 sm:mt-0">
        <a href="tel:0781701384">
          <button className="bg-white text-[#0d0d1a] px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform">
            📞 Appeler
          </button>
        </a>
        <a
          href="https://wa.me/33781701384"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-[#07c2e5] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#06a0bd] transition">
            💬 WhatsApp
          </button>
        </a>
      </div>
    </div>
  </header>
);

export default Header;

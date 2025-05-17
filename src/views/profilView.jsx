import React , {useState} from "react";

const Profil = () => {

    const tagsData = [
        { nom: "46L/90H", imageUrl: "/46L90HF.jpeg" },
        { nom: "85L/200H", imageUrls: [
            "/85L200HF.jpeg",
            "/85L200HFBLANC.jpeg",
            "/85L200HFOD.jpeg",
            "/85L200HFOG.jpeg"
          ]
        },
        { nom: "96L/92H", imageUrl: "/96L92HF.jpeg" },
        { nom: "100L/130H", imageUrl: "/100L130H.jpeg" },
        { nom: "100L/215H", imageUrls: [
            "/100L215HBLANC.jpeg",
            "/100L215HGRIS.jpeg",
            "/100L215HMARRON.jpeg",
            "/100L215HNOIR.jpeg",
            "/100L215HNOIR2.jpeg",
            "/100L215HNOIR3.jpeg"
          ]
        },
        { nom: "106L/162H", imageUrl: "/106L162HF.jpeg" },
        { nom: "115L/112H", imageUrl: "/115L112HF.jpeg" },
        { nom: "130L/130H", imageUrl: "/130L130HF.jpeg" },
        { nom: "130L/205H", imageUrl: "/130L205HF.jpeg" },
        { nom: "130L/206H", imageUrl: "/130L206HF.jpeg" },
        { nom: "130L/215H", imageUrls: [
            "/130L215HMARRON.jpeg",
            "/130L215HNOIR.jpeg"
          ]
        },
        { nom: "140L/164H", imageUrl: "/140L164HF.jpeg" },
        { nom: "183L/128H", imageUrl: "/183L128HF.jpeg" },
        { nom: "186L/140H", imageUrl: "/186L140HF.jpeg" },
        { nom: "190L/205H", imageUrls: [
            "/190L205HF.jpeg",
            "/190L205HF2.jpeg",
            "/190L205HF3.jpeg"
          ]
        },
        { nom: "212L/164H", imageUrl: "/212L164HF.jpeg" },
        { nom: "300L/140H", imageUrl: "/300L140HF.jpeg" }
      ];
      
      
const [selected , setSelected] = useState()

  return (
    <div className=" m-2 min-h-screen  bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d0d1a] to-[#13132b] h-32 relative">
        <div className="absolute inset-x-0 top-16 flex justify-center">
            {/* Avatar Emoji */}
            <img className="w-32 h-32 rounded-full shadow-md " src="/soLogo.png" alt="" />
        </div>
      </div>

      {/* Main Info */}
      <div className="pt-16 pb-4 text-center px-4">
        <h2 className="text-xl font-semibold text-gray-800">Sow Ocaz</h2>
        <h1 className="text-[#07c2e5]  font-bold">07 81 70 13 84</h1>
        <p className="text-sm text-blue-600"></p>
        <p className="text-sm text-gray-500 mt-1"></p>

        {/* Buttons */}
        <div className="flex justify-center gap-2 mt-4">
        <a href="tel:0781701384" className="inline-block">
  <button className="px-4 py-1 bg-gray-100 text-black animate-bounce rounded-full text-sm">
    Appeler
  </button>
</a>
<a
  href="https://wa.me/33781701384"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block"
>
  <button className="px-4 py-1 bg-gray-100 rounded-full text-sm text-black ">
    Envoyer un message
  </button>
</a>
        </div>

        {/* Description */}
        <p className="my-4 text-sm text-gray-700">
        Vente de fenêtres et portes-fenêtres en pvc avec possibilité de faire la pose 📥
        </p>
      </div>

      {/* Information Section */}
      <div className="px-4 pt-8 border-t text-sm text-gray-700">
        <h3 className="font-semibold text-base mb-3">Information</h3>
        <div className="mb-2">
          <span className="font-medium">🌐 Transport en ile de France et envoi sur les pays de l'Afrique de l'Ouest :</span>{" "}
          <a href="https://www.wefretafrica.fr/" className="text-[#07c2e5]" target="_blank" rel="noreferrer">
            Cliquer ici
          </a>
        </div>
        <div className="mb-2">
          <span className="font-medium">📧 Email:</span>{" "}
          <a href="mailto:bohoumecoly@hotmail.fr" className="text-[#07c2e5]">
            Envoyer un mail
          </a>
        </div>
        <div className="mb-2">
          <span className="font-medium">📞 Téléphone:</span> 07 81 70 13 84
        </div>
        <div className="mb-2">
          <span className="font-medium"></span> 
        </div>

        {/* Tags */}
        <h3 className="font-semibold text-base my-4">Cliquez sur la dimension </h3>
        <div className="flex justify-around flex-wrap gap-4 mt-4">
          {tagsData.map((tag) => (
          <span
          onClick={() => {
            setSelected(tag);
            document.getElementById('my_modal_1').showModal();
          }}
          key={tag.nom}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-l text-xs"
        >
          {tag.nom}
        </span>
          ))}
        </div>
      </div>



  






      <dialog id="my_modal_1" className="modal">
  <div className="modal-box bg-white max-h-[70%] ">
    <h3 className="font-bold text-[#07c2e5] text-lg mb-2">{selected?.nom}</h3>

    {selected?.imageUrls ? (
      <div className="carousel carousel-center bg-white rounded-box shadow-2xl max-w-md space-x-4 p-4 m-2">
        {selected.imageUrls.map((url, index) => (
          <div className="carousel-item" key={index}>
            <img src={url} alt={`Image ${index}`} className="h-96 w-64  rounded-box  " />
          </div>
        ))}
      </div>
    ) : selected?.imageUrl ? (
      <img src={selected.imageUrl} alt="Image du modèle" className=" h-96 w-64 rounded-box mx-auto  " />
    ) : (
      <img src="/soLogo.png" alt="Image par défaut" className=" h-96 w-64 rounded-box mx-auto  " />
    )}

    <div className="modal-action">
      <form method="dialog">
        <button className="btn">Fermer</button>
      </form>
    </div>
  </div>
</dialog>



    </div>
  );
};

export default Profil;

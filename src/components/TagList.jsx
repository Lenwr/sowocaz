import React from "react";

const TagList = ({ tags, onSelect }) => (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4 justify-items-center">
    {tags.map((tag) => (
      <button
        key={tag.nom}
        onClick={() => onSelect(tag)}
        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition focus:ring-2 focus:ring-[#07c2e5] focus:outline-none"
        aria-label={`Voir détails pour ${tag.nom}`}
      >
        {tag.nom}
      </button>
    ))}
  </div>
);

export default TagList;

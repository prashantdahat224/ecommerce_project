import { useState } from "react";

export default function SortDropdown({ onSort }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Sort");

  const options = [
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest", value: "newest" },
    { label: "Popular", value: "popular" },
  ];

  const handleSelect = (option) => {
    setSelected(option.label);
    onSort(option.value);
    setOpen(false);
  };

  return (
    <div className="relative w-48">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white border rounded-lg px-4 py-2 text-left shadow-sm"
      >
        {selected}
      </button>

      {open && (
        <div className="absolute w-full bg-white border rounded-lg mt-1 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
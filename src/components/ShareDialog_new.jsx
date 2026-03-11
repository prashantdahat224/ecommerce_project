import { useEffect, useState } from "react";
import whatsappIcon from "../assets/icon_whatsapp.png"

export default function ShareDialog_new({
  isOpen,
  onClose,
  productName,
  productId,
  
}) {
  const [show, setShow] = useState(false);

  // small animation control
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // WhatsApp share link
  const handleWhatsAppShare = () => {
     const productUrl = `https://gifts-and-craft.netlify.app/product/${productId}`; 
          const text = `${productName} ${productUrl}`;
   // const text = `hey, I want this gift: ${url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Background */}
      <div
        className="absolute inset-0 "     // bg-black/40
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`
           border border-gray-400
          relative bg-white w-[90%] max-w-xs rounded-xl p-5
          transform transition-all duration-200
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Title */}
        <h2 className="text-base font-semibold text-center mb-4">
          Share Product
        </h2>

        {/* WhatsApp button */}
        <button
          onClick={handleWhatsAppShare}
          className="
            flex items-center justify-center gap-3
            w-full py-3 rounded-lg
             border border-gray-400
            transition-transform duration-150 active:scale-95
          "
        >
          <img src={whatsappIcon} alt="whatsapp" className="w-5 h-5" />

          <span className="text-black text-sm font-medium">
            WhatsApp
          </span>
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
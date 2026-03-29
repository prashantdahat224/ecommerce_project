import { useRef, useState } from "react";
import LazyImage from "../placeHolder/lazyImage";
import { useNavigate } from "react-router-dom";
import OfferPosterPlcehoder from "../placeHolder/OfferPosterPlaceholder";

const OfferPoster = ({ offers = [], loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  if (loading) return <OfferPosterPlcehoder />;
  if (offers.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto lg:w-110">

      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
      >
        {offers.map((offer) => (
          <div key={offer.id} className="flex-shrink-0 w-full snap-center">
            <div
              onClick={() =>
                offer.product_id && navigate(`/product/${offer.product_id}`)
              }
              className="w-full h-40 cursor-pointer"
            >
              <LazyImage
                src={offer.public_url}
                alt={offer.id || ""}
                className="w-full h-40 object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-1 space-x-2">
        {offers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  left: idx * sliderRef.current.offsetWidth,
                  behavior: "smooth",
                });
              }
            }}
            className={`w-1.5 h-1.5 rounded-full ${
              idx === currentIndex ? "bg-gray-900" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default OfferPoster;

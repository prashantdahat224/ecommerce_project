import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/downloade_categories_icon_default.png";
import LazyImage from "../placeHolder/lazyImage";
import CategoryBarSkeleton from "../placeHolder/CategoryBarPlaceholder";
import { API_URL } from "../../config/api";

function Brand_Bar({ brand_id, onChange }) {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_URL}/brands`);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.error || "Fetch failed");
        }

        setBrands(data);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchBrands();
  }, []);

  const handleClick = (id) => {
    if (!brand_id) {
      navigate(`/BrandsProducts/${id}`, { replace: true });
    } else {
      onChange(id);
    }

    if (id === "all") {
      navigate("/CategoriesPage", { replace: true });
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-hide py-2">

      {loading ? (
        <CategoryBarSkeleton />
      ) : (
        <div className="flex ml-2">

          <div
            onClick={() => handleClick("all")}
            className="flex-shrink-0 cursor-pointer w-20 flex flex-col items-center"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full border-1 border-[#bcb8ab] text-white font-bold">
              <img src={icon} alt="icon" className="w-8 h-8 object-contain p-1" />
            </div>
            <p className="mt-1 text-xs font-medium text-center">
              All
            </p>
          </div>

          {brands.map(brand => (
            <div
              key={brand.id}
              onClick={() => handleClick(brand.id)}
              className="flex-shrink-0 cursor-pointer w-20 flex flex-col items-center"
            >
              {brand.brand_image ? (
                <LazyImage
                  src={brand.brand_image}
                  alt={brand.name}
                  className="w-14 h-14 object-cover rounded-full"
                />
              ) : (
                <div className="h-14 w-14 bg-gray-200 flex items-center justify-center rounded-full">
                  <p className="text-gray-500 text-xs text-center">
                    No Image
                  </p>
                </div>
              )}

              <p className="mt-1 text-xs font-medium text-center">
                {brand.name}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Brand_Bar;

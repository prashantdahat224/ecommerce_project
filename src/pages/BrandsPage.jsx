import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesPlaceholder from "../components/placeHolder/CategoriesPlaceholder";
import back from "../assets/icon_download_back.png";
import LazyImage from "../components/placeHolder/lazyImage";
import { API_URL } from "../config/api";
import BottomNavigation from "../components/BottomNavigation";

export default function BrandsPage() {
  const [mainCategories, setMainCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(null);

  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  const navigate = useNavigate();

  // Fetch main categories on mount
  useEffect(() => {
    fetchMainCategories();
  }, []);

  // Fetch brands whenever selected main category changes
  useEffect(() => {
    if (selectedMainId) {
      fetchBrands(selectedMainId);
    }
  }, [selectedMainId]);

  const fetchMainCategories = async () => {
    try {
      setLoadingMain(true);

      const res = await fetch(`${API_URL}/get-main-categories`);
      const data = await res.json();

      setMainCategories(data || []);

      // auto-select first main category
      if (data && data.length > 0) {
        setSelectedMainId(data[0].id);
      }

    } catch (err) {
      console.error("Main category fetch failed:", err);
    } finally {
      setLoadingMain(false);
    }
  };

  const fetchBrands = async (mainCategoryId) => {
    try {
      setLoadingBrands(true);

      const res = await fetch(
        `${API_URL}/get-all-brands?main_category_id=${mainCategoryId}`
      );
      const data = await res.json();

      setBrands(data || []);

    } catch (err) {
      console.error("Brands fetch failed:", err);
    } finally {
      setLoadingBrands(false);
    }
  };

  if (loadingMain) {
    return <div className="lg:mx-60"><CategoriesPlaceholder /></div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="sticky top-0 bg-white z-50 border border-gray-300">
        <div className="flex items-center gap-2 ml-4 p-2">
          <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
          <h1 className="text-lg font-semibold">Product Brands</h1>
        </div>
      </div>

      <div className="flex lg:mx-60" style={{ minHeight: "70vh" }}>

        {/* LEFT - Main Categories */}
        <div className="w-20 flex-shrink-0 bg-gray-50 overflow-y-auto border-r border-gray-200">
          {mainCategories.map((main) => {
            const isSelected = main.id === selectedMainId;

            return (
              <div
                key={main.id}
                onClick={() => setSelectedMainId(main.id)}
                className={`flex flex-col items-center py-3 cursor-pointer ${
                  isSelected ? "bg-white border-l-4 border-[#ffd912]" : ""
                }`}
              >
                <div className="w-10 h-10 aspect-square overflow-hidden rounded-full bg-gray-100">
                  {main.main_category_image && (
                    <LazyImage
                      src={main.main_category_image}
                      alt={main.name}
                      className="w-10 h-10 object-cover"
                    />
                  )}
                </div>
                <p
                  className={`text-xs mt-1 text-center break-words leading-3 line-clamp-2 w-16 ${
                    isSelected ? "font-bold" : "text-gray-600"
                  }`}
                >
                  {main.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT - Brands */}
        <div className="flex-1 px-2 py-4 overflow-y-auto">
          {loadingBrands ? (
            <CategoriesPlaceholder />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {brands.map((category) => (
                <div
                  key={category.id}
                  onClick={() => navigate(`/BrandsProducts/${category.id}`)}
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-15 h-15 aspect-square overflow-hidden rounded-full bg-gray-100">
                    {!(category.brand_image === "") && (
                      <LazyImage
                        src={category.brand_image}
                        alt={category.name}
                        className="w-15 h-15 object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="text-sm mt-1 text-center break-words leading-4 line-clamp-2 w-20">
                    {category.name}
                  </p>
                </div>
              ))}

              {brands.length === 0 && (
                <p className="text-gray-400 text-sm col-span-3 text-center mt-4">
                  No brands found
                </p>
              )}
            </div>
          )}
        </div>

      </div>

      <div className="h-26 lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/new_icon_cat.png";
import LazyImage from "../placeHolder/lazyImage";
import CategoryBarSkeleton from "../placeHolder/CategoryBarPlaceholder";
import { API_URL } from "../../config/api";

function CategoryBar({ categories = [], loading = false, cat_id, onChange }) {
  const navigate = useNavigate();
  const [localCategories, setLocalCategories] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (categories.length > 0) return; // ✅ skip if parent already passed data
    setLocalLoading(true);
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setLocalCategories(data))
      .catch(console.error)
      .finally(() => setLocalLoading(false));
  }, []);

  const displayCategories = categories.length > 0 ? categories : localCategories;
  const isLoading = loading || localLoading;

  const handleClick = (id) => {
    if (id === "all") {
      navigate("/CategoriesPage", { replace: true });
      return;
    }
    if (!cat_id) {
      navigate(`/CategoryProducts/${id}`, { replace: true });
    } else {
      onChange(id);
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-hide py-2">

      {isLoading ? (
        <CategoryBarSkeleton />
      ) : (
        <div className="flex ml-2">

          <div
            onClick={() => handleClick("all")}
            className="flex-shrink-0 cursor-pointer w-20 flex flex-col items-center"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full border-1 
            border-[#0b5eac] text-white font-bold">
              <img src={icon} alt="icon" className="w-8 h-8 object-contain p-1" />
            </div>
            <p className="mt-1 text-xs font-medium text-center">
              All Categories
            </p>
          </div>

          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="flex-shrink-0 cursor-pointer w-20 flex flex-col items-center"
            >
              {cat.category_image ? (
                <LazyImage
                  src={cat.category_image}
                  alt={cat.name}
                  className="w-14 h-14 object-cover rounded-full"
                />
              ) : (
                <div className="h-14 w-14 bg-gray-200 flex items-center justify-center rounded-full">
                  <p className="text-gray-500 text-xs text-center">No Image</p>
                </div>
              )}
              <p className="mt-1 text-xs font-medium text-center">
                {cat.name}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default CategoryBar;

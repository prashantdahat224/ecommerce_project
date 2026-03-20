import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { supabase } from "../supabaseClient";
import CategoriesPlaceholder from "../components/placeHolder/CategoriesPlaceholder";
import back from "../assets/icon_download_back.png";
import LazyImage from "../components/placeHolder/lazyImage";
 import { API_URL } from "../config/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API_URL}/get-all-categories`);
    const data = await res.json();

    setCategories(data || []);

  } catch (err) {
    console.error("Category fetch failed:", err);
  } finally {
    setLoading(false);
  }
};

    if (loading) { return <div className="lg:mx-60"><CategoriesPlaceholder /></div>;}


    
  return (
     <div >
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50 border border-gray-300">
            <div className="flex items-center gap-2 ml-4 p-2">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Product Categories </h1>
            </div>
            
          </div>

    <div className="px-2 py-4 lg:mx-60">
      <h1 className="text-lg font-semibold mb-3 text-center mb-5">Product Categories</h1>

      <div className="grid grid-cols-4 gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/CategoryProducts/${category.id}`)}
            className="cursor-pointer flex flex-col items-center"
          >
            {/* Image */}
            <div className="w-20 h-20 aspect-square overflow-hidden rounded-full bg-gray-100">
              {!(category.category_image ==="") &&(<LazyImage
                src={category.category_image}
                alt={category.name}
                className="w-20 h-20 object-cover transition-transform group-hover:scale-105"
              />)}
            </div>

            {/* Name */}
            <p className="text-sm mt-1 text-center truncate">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
      </div >
  );
}

import { useEffect, useState } from "react";
//import { supabase } from "../../supabaseClient";
import ProductCard from "../ProductCard";
import { API_URL } from "../../config/api";
 


const PAGE_SIZE =30; 

export default function CategoryProductList({categoryId}) {
     
  //console.log("categoryId",categoryId);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading_for_refresh, setLoading_for_refresh] = useState(true); //added 

       // console.log("✅categoryId",categoryId)

  

   const fetchProducts = async (reset = false) => {
  if (loading || !hasMore) return;

  setLoading(true);
  setLoading_for_refresh(true);

  const nextPage = reset ? 0 : page;

  try {
    const res = await fetch(
      `${API_URL}/brand-products?categoryId=${categoryId}&page=${nextPage}&size=${PAGE_SIZE}`
    );

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      setHasMore(false);
      return;
    }

    if (reset) {
      setProducts(data);
      setPage(1);
    } else {
      setProducts(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
    }

  } catch (err) {
    console.error("Category fetch failed:", err);
  } finally {
    setLoading(false);
    setLoading_for_refresh(false);
  }
};


     useEffect(() => {
       setProducts([]);
   setPage(0);
   setHasMore(true);
    fetchProducts(true); //true
  }, [categoryId]);


   

 

  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Product Grid */}
      {(products.length === 0) && <p className=" text-gray-500">No items in Category.</p>}
      <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
          
  

    <div>
      {loading && hasMore && (
  <div 
  className="grid grid-cols-2 gap-6 mt-6 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-64 bg-gray-200 rounded-lg" />
    ))}
    
  </div>
)}
  </div>


  {/* Refresh Button */}
      {(!loading_for_refresh) && hasMore && (
        <div className="flex justify-center mt-5">
          <button onClick={() =>{ fetchProducts(true)}}
           // disabled={loading}
            className="
              px-4 py-1 rounded-lg text-sm
              text-blue-500
              border border-gray-200
              hover:bg-gray-200
              transition
            "
          >
              Refresh page  {/* {loading ? "Refreshing..." : "Refresh page"} */}
          </button>
        </div>
      )}


    </section>

  );
}

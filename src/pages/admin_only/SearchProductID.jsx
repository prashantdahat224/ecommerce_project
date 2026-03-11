import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link, Navigate } from "react-router-dom";
import back from "../../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
//import { useSelector } from "react-redux";



export default function SearchProductID() {

  const {productIds} = useParams();
  
  const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


   

    const fetchProductsByIds = async () => {
      
      setLoading(true);
     

      const { data, error } = await supabase
        .from("products")
        .select("id,name,featured_image,product_code")
        .eq("id", productIds);  //.in("id", productIds);  

      if (error) {
        console.error("Error fetching products:", error,productIds);
        setLoading(false);
        return;
      }

       const productsWithUrls = data.map((p) => {
        let publicUrl = "";
        if (p.featured_image) {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(p.featured_image);
          publicUrl = urlData.publicUrl;
        }
        return { ...p, featured_image_url: publicUrl };
      });

      setProducts(productsWithUrls);
      setLoading(false);
    };
  useEffect(() => {
    if (!productIds || productIds.length === 0) {
      setLoading(false);
      return;
    }

  

    fetchProductsByIds();
  }, [productIds]);

  //if (goBack) return <Navigate to="../AdminOption" />;

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-2  my-2 ml-4">
          <img
            src={back}
            alt="Back"
            className="h-10 w-10"
            onClick={() =>  navigate(-1)}
          />
            <p className="text-left text-lg font-medium text-gray-900"> Product Posts</p>
               
                <button
          onClick={fetchProductsByIds}
           className="bg-gray-200 p-1 rounded">Refresh</button> 

             
        </div>
        <hr className="border-gray-300" />
      </div>

      <div className="p-4">
        <h1 className="text-lg font-semibold mb-4">
          Select the Product Posts for for edit
        </h1>

        {loading && (
          <p className="text-center text-gray-500 font-medium my-4">Loading...</p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500 font-medium my-4">
            No products found.
          </p>
        )}

        {/* Product List */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} to={`/admin_only/product/${product.id}`}>
              <div className="border rounded p-2 hover:shadow">
                {product.featured_image_url ? (
                  <img
                    src={product.featured_image_url}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500">
                    No Image
                  </div>
                )}
                <h2 className="text-sm font-semibold mt-2">{product.name}</h2>
                <p className="text-xs text-gray-500">{product.product_code}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
 import { useSelector } from "react-redux";  //added
import CartItem from "../components/CartItem";
 import FullScreenLoader from "../utils/FullScreenLoader"; 
import back from "../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import ProductCard from "../components/ProductCard"
import { API_URL } from "../config/api";

 
export default function ProductWhishList() {
     const userID = useSelector((state) => state.auth.user?.id); //added
  const [cartItems, setCartItems] = useState([]);
   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const [count, setCount] = useState(0);
    const [mainPageOpen, setMainPageOpen] = useState(true);

     const [product_purchase_id2, setProduct_purchase_id2] = useState(true);
    const [user_new2, setUser_new2] = useState(null);

   


  useEffect(() => {
    if(userID){
 fetchCartItems();
    }
   
  }, [userID]);
 
    
     async function fetchCartItems() {
  setLoading(true);

  const response = await fetch(`${API_URL}/product-wishlist-new`, {
    method: "POST",
    //headers: { "Content-Type": "application/json" },
    //body: JSON.stringify({ userId, action: "fetch" }),
   // body: JSON.stringify({ action: "fetch" }),
   headers: { 
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("access_token")}`
},
body: JSON.stringify({ action: "fetch" }),

  });

  const result = await response.json();

  if (result.error) {
    console.error(result.error);
    setLoading(false);
  } else {
    const withUrls = result.wishListItems.map(cat => {
      return {
        ...cat,
        products: {
          ...cat.products,
          product_image_url: cat.products.product_image_url || ""
        }
      };
    });

    setCartItems(withUrls);
    setCount(result.count);
    setLoading(false);
  }
}

async function removeItem(wish_list_Id) {
  setLoading(true);

  const response = await fetch(`${API_URL}/product-wishlist-new`, {
    method: "POST",
   // headers: { "Content-Type": "application/json" },
    //body: JSON.stringify({ userId, action: "remove", wishListId: wish_list_Id }),
    headers: { 
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("access_token")}`
},
body: JSON.stringify({ action: "remove", wishListId: wish_list_Id }),
  });

  const result = await response.json();

  if (result.error) {
    console.error(result.error);
    setLoading(false);
  } else {
    const updatedCartItems = cartItems.filter((item) => item.id !== wish_list_Id);
    setCartItems(updatedCartItems);
    setCount(updatedCartItems?.length || 0);
    setLoading(false);
  }
}


  return (
     <div >
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50 border border-gray-300">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Shoping cart </h1>
            </div>
             
          </div>
            <FullScreenLoader loading={loading}
      message=" loading..."/>



           <div className="max-w-2xl mx-auto mt-8">

            <h1 className="text-xl mb-6 mt-5 py-2 font-semibold ml-4">Wish list | {!(loading) && count} Items</h1>

       {cartItems.length === 0 ? (
        <p className="text-gray-500 p-4">No items in whis list</p>
      ) : (
        <section className="max-w-7xl mx-auto px-1">
        <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cartItems.map((item) => (
           
          <div key={item.id} className="  rounded mt-2" >
            <div className="border border-gray-300 p-1 rounded">
            <ProductCard product={item.products} />
            <button onClick={() => removeItem(item.id)}
              className="mt-1 text-sm text-gray-600 border border-gray-300 px-3 p-1 rounded"      //{/* bg-red-500 hover:bg-red-600*/}
            >
              Remove from list
            </button>
            </div>
          </div>
        ))}
          </div>
          </section>
        
      )}
    </div> 
    
     <div className="h-26 lg:hidden">
      <BottomNavigation />
      </div>
     </div >
  );
}

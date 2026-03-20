import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
 import { useSelector } from "react-redux";  //added
import CartItem from "../components/CartItem";
 import FullScreenLoader from "../utils/FullScreenLoader"; 
import back from "../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import PurchaseNow from "../components/PurchaseNow";
import { API_URL } from "../config/api";

export default function ProductCartNew() {
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

  // async function fetchCartItems() {
     
  //   setLoading(true);
  //   const { data, error } = await supabase
  //     .from("product_cart")
  //     .select("id,user_id, product_id, products(name,currency, price, product_image,product_code,about)")
  //     .eq("user_id", userID);

  //   if (error) {
  //       console.error(error);
  //        setLoading(false);}
  //   else {
         
  //       /////////////////////////////
  //         const withUrls = data.map(cat => {
  //               let publicUrl = null;
  //               if (cat.products.product_image) {
  //                 const { data: urlData } = supabase
  //                   .storage
  //                   .from("products")
  //                   .getPublicUrl(cat.products.product_image);
  //                 publicUrl = urlData.publicUrl;
  //                // console.log(publicUrl);
  //                setLoading(false);
  //               }
  //               return {
  //                 ...cat,
  //                     products:{
  //                       ...cat.products,
  //                            product_image_url: publicUrl || ""
  //                     }
                    
                   
  //               };
  //              // console.log(publicUrl)
  //             });

  //             setLoading(false);
  //             setCartItems(withUrls);
  //             setCount(data?.length);
         
 
         

  //   }
  //   setLoading(false);
  // }

  // async function removeFromCart(cartId) {
  //   setLoading(true);
  //   const { error } = await supabase
  //     .from("product_cart")
  //     .delete()
  //     .eq("id", cartId);

  //   if (error){ console.error(error);
  //       setLoading(false);
  //   }
  //   else {
  //     const updatedCartItems = cartItems.filter((item) => item.id !== cartId);
  //     setCartItems(updatedCartItems);
  //     setCount(updatedCartItems?.length || 0);

  //   setLoading(false);}
  // }


  async function fetchCartItems() {
  setLoading(true);

  const response = await fetch(`${API_URL}/product-cart-new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action: "fetch" }),
  });

  const result = await response.json();

  if (result.error) {
    console.error(result.error);
    setLoading(false);
  } else {
    const withUrls = result.cartItems.map(cat => {
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

async function removeFromCart(cartId) {
  setLoading(true);

  const response = await fetch(`${API_URL}/product-cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action: "remove", cartId }),
  });

  const result = await response.json();

  if (result.error) {
    console.error(result.error);
    setLoading(false);
  } else {
    const updatedCartItems = cartItems.filter((item) => item.id !== cartId);
    setCartItems(updatedCartItems);
    setCount(updatedCartItems?.length || 0);
    setLoading(false);
  }
}



    function PerchaseFromCart(user_id_now,product_now) {
        setProduct_purchase_id2(product_now);
      setUser_new2(user_id_now);
    setMainPageOpen(false);
    }
     

  return (
     <div className="bg-gray-100">
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50 border border-gray-300">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Shoping cart </h1>
            </div>
             
          </div>
            <FullScreenLoader loading={loading}
      message=" loading..."/>



   {mainPageOpen?( <div className="max-w-2xl mx-auto mt-8">

            <h1 className="text-xl mb-6 mt-5 p-2 font-semibold">Cart | {count} Items</h1>

       {cartItems.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        cartItems.map((item) => (
          <CartItem key={item.id} item={item} onRemove={removeFromCart} onPurchase={PerchaseFromCart}/>
        ))
      )}
    </div>):(
     <div>
             <PurchaseNow
                  product={product_purchase_id2}
                  userId={user_new2}/>
                  </div>   
    )}
    
     <div className="h-26 bg-gray-100 lg:hidden">
      <BottomNavigation />
      </div>
     </div >
  );
}

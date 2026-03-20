import icon2 from "../assets/icons_heart_black_for_card.png"; 
 import {  useState } from "react";

import icon from "../assets/icons_plus_ad_to_cart.png";
import LazyImage from "./placeHolder/lazyImage";
import { Link } from "react-router-dom";
 // import { supabase } from '../supabaseClient';

import { useSelector } from "react-redux";
import ProccesMessages from "./ProccesMessages";
import LoginDialog from "../components/LoginDialog"





function ProductCard({ product }) {



  const { user, loading } = useSelector((state) => state.auth);

  const imageUrl =  product.product_image || "";
   const [cartMessage, setCartMessage] = useState(false);//added
      const [message, setMessage] = useState("");//added
          const [showDialog, setShowDialog] = useState(false);
          const [icon_show_now, setIcon_show_now] = useState(true);
           
    
   
 
  
   const handleAddToCart = async () => {
  if (!user) {
    setShowDialog(true);
    return;
  }

  try {
     setMessage("Product added to cart");
     setIcon_show_now(true);
    setCartMessage(true);
    const res = await fetch("/.netlify/functions/add-to-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        product_id: product.id
      })
    });

    const result = await res.json();

    if (result.error) {
     // setMessage("Error adding to cart, refresh page");
      alert("Error adding to cart, refresh page");
    } else if (result.status === "added") {
     // setMessage("Product added to cart");
    } else {
       setIcon_show_now(true);
      setMessage("Product already in cart");
    }
       setIcon_show_now(true);
    setCartMessage(true);

  } catch (err) {
    setMessage("Network error, try again");
     setIcon_show_now(true);
    setCartMessage(true);
  }
};



  

  return (
    <div className="w-38 h-64">
      
      {/* <button onClick={()=>setCartMessage(true)}> </button> */}

    <Link to={`/product/${product.id}`}>
    <div className="w-38 h-63 rounded-xl border border-neutral-200 bg-white overflow-hidden lg:max-w-[190px]">
      
    
      
      {/* IMAGE */}
      <div className="relative w-38 h-45 bg-neutral-100">
        {imageUrl? (( <LazyImage
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          
         />)):( 
           <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded ">
          <p className="text-sm text-gray-500 text-center">No Image</p>
                  </div>
         )} 
    
      </div>
 
      {/* CONTENT */}
      <div className="ml-1 p-1">
       
        {/* TITLE */}
        <h3 className="text-sm text-neutral-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* CATEGORY */}
        <p className="text-[11px] uppercase tracking-widest text-neutral-400">
          {product.about || ""}
        </p>

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              {product.currency}{product.price}
            </span>
      
             
          </div>

          {/* PRICE RIGHT BUTTON */}
          {/* <button
          onClick={ handleWishlist}
          className="h-7 w-7 rounded-full border border-neutral-200 bg-white flex items-center justify-center">
              <img src={icon} className="h-4 w-4" />
           </button> */}
           
         
<LoginDialog open={showDialog} onClose={() => setShowDialog(false)} />
  
                            <ProccesMessages
                                          show={cartMessage}
                                          message={message}
                                          icon_show={icon_show_now}
                                          onClose={() => setCartMessage(false)}
                                        />
        
                           

        </div>
       
      </div>
    </div>
</Link>
       <div className="relative ">
 <button
          onClick={handleAddToCart}
          
          className="h-7 w-7 absolute bottom-2 right-2
            rounded-full border border-neutral-200 bg-white flex items-center justify-center">
               <img src={icon} className="h-4 w-4"/> 
           </button>
            </div>
 </div>
          

    

   
     
  );
}

export default ProductCard;

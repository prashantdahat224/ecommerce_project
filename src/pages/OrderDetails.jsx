// src/pages/OrderPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
 import FullScreenLoader from "../utils/FullScreenLoader"; 
import back from "../assets/icon_download_back.png";
 import { API_URL } from "../config/api";


export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from("orders")
  //       .select("*")
  //       .eq("id", orderId)
  //       .single();

  //     if (error) {
  //       setLoading(false);
  //       console.error(error);
  //     } 
  //     //////////////////////////////////////
  //     if(data) {
  //       setOrder(data);
  //        if(data.product_image)
  //         {const { data: urlData } = supabase.storage
  //      .from("products")
  //      .getPublicUrl(data.product_image);
      
  //     setOrder((prev) => ({
  //        ...prev,
  //         public_image_url: urlData.publicUrl,
  //           }));}
  //           setLoading(false);
  //     }
  //         //////////////////////////////////////
  //     setLoading(false);
  //   };

  //   fetchOrder();
  // }, [orderId]);
 useEffect(() => {
  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/get-order-details?id=${orderId}`
      );

      const data = await res.json();

      if (!data.error) {
        setOrder(data);
      }

    } catch (err) {
      console.error("Order fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [orderId]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Order not found</p>
      </div>
    );
  }

  return (

     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Order details </h1>
            </div>
            <hr />
          </div>
  <FullScreenLoader loading={loading}
      message=" loading..."/>

     
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">

        {/* Product Card */}
        <div
          onClick={() => navigate(`/product/${order.product_id}`)}
          className=" flex gap-2 cursor-pointer hover:shadow transition rounded-lg p-1"
        >
          <img
            src={order.public_image_url}
            alt={order.product_name}
            className="w-20 h-20 object-cover rounded-lg"
          />

         <div>
          <h2 className="mt-4 text-lg   text-gray-800">
            {order.product_name}
          </h2>
          <button className="text-blue-600 border border-blue-600 p-1 rounded">Go to product details</button>
          </div>


        </div>
<hr className="border-gray-500 my-6" />
        {/* Track Order Button */}
        <button
          onClick={() => navigate(`/OrderTracking/${order.id}`)}
          className="mt-6 w-full border border-blue-600 text-blue-600 py-2 rounded-lg   transition"
        >
        Order Updates 
        </button>
        <hr className="border-gray-500 my-6" />
         <button 
        onClick={()=>navigate("/HelpCenterPage")}
           className="mt-6 p-2 border border-gray-400 text-black text-sm font-semibold  rounded-lg   transition"
        >
          Need help 
        </button  >

      </div>
    </div>
    </div >
  );
}

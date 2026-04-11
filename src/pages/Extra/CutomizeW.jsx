import React from "react";
import icon1 from "../../assets/icon_whatsapp.png"
import FullScreenLoader from "../../utils/FullScreenLoader";
import back from "../../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
// import { supabase } from "../supabaseClient";
import { API_URL } from "../../config/api";


const CutomizeW = () => {

     const [phoneNumber, setPhoneNumber] = useState(null);
   const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

  //const phoneNumber = "919876543210"; // country code + number
  const message = "Hi, Cutomize my product.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent( message)}`;
 
   
  useEffect(() => {
  const fetchAdminNumber = async () => {
    setLoading(true);

    const response = await fetch(`${API_URL}/help-center`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (result.error) {
      console.error("Error fetching admin number:", result.error);
    } else {
      setPhoneNumber(result.phoneNumber);
    }

    setLoading(false);
  };

  fetchAdminNumber();
}, []);

  return (

     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-2">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />


            <h1 className="text-lg font-semibold"> Cutomize The product now </h1>
            </div>
            <hr />
          </div>

    <div className="min-h-screen bg-gray-50 flex mt-10 justify-center px-4">

   <FullScreenLoader loading={loading}
      message=" loading..."/>


      <div className="bg-white max-w-md w-full rounded-2xl  p-6 text-center">
        
        <p 
        className="text-2xl font-semibold text-black mb-2"
        
        >
          Just make it now
        </p>
        

        <p className="text-lg text-gray-600 mb-6">
          Customize your product via WhatsApp chat.
         Let us know your style, and we’ll make it for you!
        </p>

        {((!loading) && (phoneNumber)) && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 text-[#2fb144] font-semibold py-3 px-6 rounded-xl transition border border-gray-400"
        >
          <img
            src={icon1}
            alt="WhatsApp"
            className="w-6 h-6"
          />
          Ask on WhatsApp
        </a>
        )}


      </div>
    </div>
     </div >
  );
};

export default CutomizeW;

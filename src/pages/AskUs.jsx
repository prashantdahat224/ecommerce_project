import React from "react";
import icon1 from "../assets/icon_whatsapp.png"
import FullScreenLoader from "../utils/FullScreenLoader";
import back from "../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { supabase } from "../supabaseClient";
import BottomNavigation from "../components/BottomNavigation";
 import { API_URL } from "../config/api";



const AskUs = () => {

     const [phoneNumber, setPhoneNumber] = useState(null);
   const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

  //const phoneNumber = "919876543210"; // country code + number
  // const message = "Hey, I wanna Ask you something.";
  // const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent( message)}`;
 const message = "Hey, I wanna Ask you something.";
const whatsappUrl = phoneNumber
  ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  : "#";
  
     useEffect(() => {
  const fetchAdminNumber = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/get-admin-phone`);
      const data = await res.json();

      if (!data.error) {
        setPhoneNumber(data.phone_number);
      }

    } catch (err) {
      console.error("Error fetching admin number:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAdminNumber();
}, []);

    return (
      <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50 border border-gray-300">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-9 w-9" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Ask us </h1>
            </div>
             
          </div>
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We Are a Trusted Platform Delivering the Best Products for You
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white"> {/*text-blue-100 */}
           So many customers trust us for quality, reliability, and
            exceptional service.
          </p>
          
           
          
            {/* {((!loading) && (!phoneNumber)) && ( */}
             {(!loading && phoneNumber) && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white flex items-center justify-center gap-3 text-green-600 font-semibold py-3 px-6 rounded-xl transition "
              >
                <img
                  src={icon1}
                  alt="WhatsApp"
                  className="w-6 h-6"
                />
                Tell us on WhatsApp
              </a>
              )}
   {/* {(!loading && phoneNumber) && (
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white flex items-center justify-center gap-3 text-green-600 font-semibold py-3 px-6 rounded-xl transition"
  >
    <img src={icon1} alt="WhatsApp" className="w-6 h-6" />
    Tell us on WhatsApp
  </a>
)} */}




                 <FullScreenLoader loading={loading}
      message=" loading..."/>

        </div>
      </section>

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow">
          <h2 className="text-3xl font-bold text-center  ">
            Tell Us What Product You Need
          </h2>
      </div>
      

       
      {/* Why Choose Us */}
      <section className="py-6 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Premium Quality",
              desc: "We ensure top quality products sourced from trusted suppliers."
            },
            {
              title: "Fast & Secure Delivery",
              desc: "Quick shipping with complete tracking and safe packaging."
            },
            {
              title: "24/7 Customer Support",
              desc: "Our team is always available to help you anytime."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

     
     
 <div className="h-26 lg:hidden">
      <BottomNavigation />
      </div>
    </div>
      </div >

    
  );
};

export default AskUs;

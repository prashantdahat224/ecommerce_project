import React from "react";
import { useNavigate } from "react-router-dom";
import back from "../assets/icon_download_back.png";

export default function AboutUs() {
       const navigate = useNavigate();
  
  return (

      <div>
              {/* HEADER */}
              <div className="sticky top-0 bg-white z-50 border border-gray-300">
                <div className="flex items-center gap-2 ml-4 p-1">
                  <img src={back} className="h-9 w-9" onClick={() => navigate(-1)} />
                               <h1 className="text-lg font-semibold"> About Us </h1>
                </div>
                 
              </div>

    <div className="min-h-screen bg-gray-50 px-6 py-12 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        {/* Heading */}
        <h1 className="text-2xl md:text-2xl font-bold text-center text-black mb-8">
          About Us
        </h1>

        {/* Intro */}
        <p className="  text-gray-600 text-justify mb-12">
          Welcome to <span className="text-black font-semibold">WISHMOS</span>,
          We are proudly Indian — developed by Indians, for the world.
          Our platform is a curated canvas dedicated to showcasing thoughtful,
           design-led Indian brands. We exist to bring the richness of Indian craftsmanship, 
           culture, and creativity onto a global stage.
We believe in more than just products.
We value intention, attention to detail, and the stories behind every creation.

With a strong focus on traceability and transparency,
 we aim to developed trust while celebrating brands that are honest in their
  process and exceptional in their quality.

This is our way of redefining how the world discovers Indian design.
        </p>

        {/* Image + Text Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {/* <img
            src="/storefront.png" // replace with your image
            alt="Our Store"
            className="w-64 h-64 object-cover rounded-lg shadow-md mx-auto"
          /> */}
          <div className="flex-1 text-gray-700">
            <h2 className="text-xl text-black font-semibold mb-4 text-center ">Our Story</h2>
            <p  >
              At Wishmos, we started with an idea: to make shopping
              effortless and enjoyable. From curated collections to fast
              delivery, we focus on bringing value to every customer.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">
              Quality
            </h3>
            <p className="text-gray-600">
              We pick products to ensure top-notch quality.
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">
              Trust
            </h3>
            <p className="text-gray-600">
              Transparent policies and secure payments.
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">
              Service
            </h3>
            <p className="text-gray-600">
              Our support team is here to help you anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
     </div>
  );
}

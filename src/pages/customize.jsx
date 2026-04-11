import { Navigate, useNavigate } from "react-router-dom";
import back from "../assets/icon_download_back.png";
import BottomNavigation from "../components/BottomNavigation";



export default function Customize() {


      const navigate = useNavigate();

  return (


     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50 border border-gray-300">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-9 w-9" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Customize your own product </h1>
            </div>
             
          </div>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
      
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
        
        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Make It Truly Yours
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          Why settle for ordinary? Customize your product exactly the way you want — 
          from design to details. Make just for you.
        </p>

<p className="text-gray-600 text-sm mt-4 mb-2">
          No extra hassle. Just tell us what you want.
        </p>
          <button 
         onClick={()=>navigate("/CustomizeW")}
        className="bg-blue-600 text-white font-semibold px-6 py-3
         rounded-full shadow-md hover:bg-blue-700 active:scale-95 transition 
         transform duration-150 w-full max-w-xs mx-auto">
Customize Your Product
</button>

        {/* Small Trust Line */}
        

        {/* Feature Highlights */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-4 rounded-2xl bg-gray-100">
            <p className="text-xl"></p>
            <h3 className="font-semibold mt-2">Personal Design</h3>
            <p className="text-sm text-gray-500">Choose styles & more</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-100">
            <p className="text-xl"></p>
            <h3 className="font-semibold mt-2">Fast Requests</h3>
            <p className="text-sm text-gray-500">Quick and easy customization</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-100">
            <p className="text-xl"></p>
            <h3 className="font-semibold mt-2">Premium Quality</h3>
            <p className="text-sm text-gray-500">Crafted just for you</p>
          </div>
        </div>

        {/* CTA Button */}
        {/* <button 
        onClick={()=>Navigate()}
        className="bg-black text-white text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg">
          Customize Your Product
        </button> */}
      

      </div>

      
    </div>
    <div className="h-10 lg:hidden">
      <BottomNavigation />
      </div>
      </div >
  );
}
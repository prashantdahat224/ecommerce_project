import React from "react";
 import back from "../assets/icon_download_back.png";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const ImagePage = () => {
 // const { imageUrl } = useParams(); // get the route param
const location = useLocation();
const { selectedImage } = location.state || {};
const navigate = useNavigate();

   console.log("works");
  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Image </h1>
            </div>
            <hr />
          </div>
    <div className="h-screen w-screen mt-1">
      <img
        src={selectedImage} // decode in case of special chars
        alt="Full size"
        //className="h-full w-full object-cover"
        className="max-w-full max-h-full object-contain"
                //className="w-full h-auto object-contain"
      />
    </div>
     </div >
  );
};

export default ImagePage;

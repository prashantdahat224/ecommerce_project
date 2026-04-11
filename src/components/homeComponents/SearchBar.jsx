import React from "react";
import searchIcon from "../../assets/search.png";  
import backIcon from "../../assets/icon_download_back.png";

import AskIcon from "../../assets/icons_whatsapp_two_downloaded.png";
import UsersIcon from "../../assets/icons_downloaded_user_default.png";
import { useNavigate } from "react-router-dom";

 
//checked / database

const SearchBar = ({

   
   search, setSearch, 
   onFocus
   ,isSearchOpen,onBack
   }) => {
 
    const navigate =useNavigate();
     
  return (
    <div className="border-b border-gray-300"> {/*added //  z-50*/}
    <div className="w-full flex items-center gap-2 px-4"> 
   
     {/* added */}
      <div className="hidden lg:flex gap-6 ml-4 items-center ">
        <button 
        onClick={()=>navigate("/AskUs")}
        className="flex items-center gap-2 p-2  ">
          <img src={AskIcon} alt="Ask" className="h-5 w-5" />
          <p  >ASK US</p>
        </button>
         
        <button
         onClick={()=>navigate("/Account")}
        className="flex items-center gap-2 p-2">
          <img src={UsersIcon} alt="Profile" className="h-4 w-4" />
          <p  >PROFILE</p>
        </button>
      </div>
     {/* added */}

     {/* Back Arrow (outside search bar) */}
       {isSearchOpen && (
        <img
          src={backIcon}
          alt="Back"
          className="w-10 h-10 cursor-pointer bg-gray-100 rounded-full   p-1"
          onClick={onBack}
        />
      )} 
    {/*deleted - shadow*/}
      <div className="
        flex items-center 
        flex-1  
        bg-white rounded-full       
        transition-all duration-300 
         border border-[#0b5eac] lg:ml-10
      ">
        {/* Search Icon */}
        <img
          src={searchIcon}
          alt="Search Icon"
          className="w-5 h-5 ml-3 text-gray-400"
        />

        {/* Input Field */}

         
         <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={onFocus}
          placeholder="Search products (e.g., luxury, etc.)..."
          className="
            flex-1 px-3 py-2 
            bg-transparent text-gray-500 placeholder-gray-500 
            text-base sm:text-base text-gray-700
            focus:outline-none rounded-full 
            transition-all duration-300 
            focus:px-4
          "
        /> 
        
        
      
      


      </div>
      
      
    </div>
    <div className="h-2" /> {/* Spacer */}
      </div>
  );
};

export default SearchBar;

import { useState,useEffect } from "react"; 
import { Link,useNavigate ,useLocation } from "react-router-dom";
//checked / database //no db

import HomeIcon from "../assets/icons_downloaded_home_defalut.png";
import HomeIconClicked from "../assets/icons_downloaded_home_clicked.png";

import AskIcon from "../assets/icons_whatsapp_two_downloaded.png";
import AskIconClicked from "../assets/icons_whatsapp_two_downloaded_clicked.png";

import customize_click from "../assets/customize_clicked.png";
import customize_defaultt from "../assets/customize_default.png";

import UsersIconClicked from "../assets/icons_downloaded_user_clicked.png";
import UsersIcon from "../assets/icons_downloaded_user_default.png";

 

const BottomNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("HOME");

  // Sync activeTab with current route
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/home") setActiveTab("HOME");
        else if (location.pathname === "/AskUs") setActiveTab("ASK");
     else if (location.pathname === "/Customizes") setActiveTab("CUSTOMIZE");
    else if (location.pathname === "/Account") setActiveTab("PROFILE");
    else { setActiveTab("");   }
  }, [location]);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-inner py-3 flex justify-around items-center border border-gray-200 ">
      <NavItem
        to="/home"
        icon={activeTab === "HOME" ? HomeIconClicked : HomeIcon}
        label="HOME"
        active={activeTab === "HOME"}
        iconClass="w-6 h-6"
      />
      <NavItem
        to="/AskUs"
        icon={activeTab === "ASK" ? AskIconClicked : AskIcon}
        label="ASK US"
        active={activeTab === "ASK"}
        iconClass="w-6 h-6"
      />
      <NavItem
        to="/Customizes"
        icon={activeTab === "CUSTOMIZE" ? customize_click : customize_defaultt}
        label="CUSTOMIZE"
        active={activeTab === "CUSTOMIZE"}
        iconClass="w-9 h-9"  
      />
      <NavItem
        to="/Account"
        icon={activeTab === "PROFILE" ? UsersIconClicked : UsersIcon}
        label="PROFILE"
        active={activeTab === "PROFILE"}
        iconClass="w-6 h-6"
      />
    </nav>
  );
};

const NavItem = ({ to, icon, label, active, iconClass = "w-6 h-6"  }) => (
  <Link to={to} className="flex flex-col items-center gap-1">
    <div className="h-8 flex items-center">   {/* fixed height   */}
    <img src={icon} alt={label} className={iconClass} />
     </div>
    <span
      className={`text-xs ${
        active ? "text-[#C19A6B]" : "text-[#64748b]"
      }`}
    >
      {label}
    </span>
  </Link>
);

 
export default BottomNavigation;

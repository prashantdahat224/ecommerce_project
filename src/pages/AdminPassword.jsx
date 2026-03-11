import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import back from "../assets/icon_download_back.png";
import { supabase } from "../supabaseClient";

import { useDispatch, useSelector } from "react-redux";
import { setAdmin } from "../redux/adminSlice";
 import FullScreenLoader from "../utils/FullScreenLoader"; 


//checked / database

function AdminPassword() {

    const { id} =useParams();
  

   const dispatch = useDispatch();

  const { isAdmin, loading } = useSelector(state => state.admin);



  const [input , setInput ] = useState("");
  const [checking, setChecking] = useState("checking");
      const [loading2, setLoading2] = useState(false);
      const [show, setShow] = useState(false);

 //console.log("data 1" );
  const navigate = useNavigate();

 
const AdminCheck = async () => {
  try {
    const res = await fetch(
      `/.netlify/functions/check-admin-role?id=${id}`
    );
    const data = await res.json();

    dispatch(setAdmin(data.isAdmin === true));

  } catch (err) {
    dispatch(setAdmin(false));
  }
 // console.log("isAdmin",isAdmin);
};





  //  const check_test = async () => {
      

  //    const { data, error } = await supabase
  //     .from("admin_users")
  //     .select("role")
  //     .eq("user_id", id)
  //     .single();

  //   if (error  ) {
  //      console.log("error",error);
  //   }
  //   if(data){
  //      console.log("data",data);
  //   }

    


  //  }



   const fetchChecking = async () => {
  try {
    setLoading2(true);

    await AdminCheck();

   // console.log("isAdmin",isAdmin);

    const res = await fetch("/.netlify/functions/get-admin-check");
    const data = await res.json();

    if (data.code) {
      setChecking(data.code);
      setShow(true);
    } else {
      alert("There is some problem, refresh app");
    }

  } catch (err) {
    alert("Network error, try again");
  } finally {
    setLoading2(false);
  }
  console.log("checking",checking);
};

  const handlePassword = () => {
    
  //  console.log("checking",checking);
   
   

    if (input  === checking) {
      //console.log(input,checking); AdminOption
      navigate("/admin_only/AdminOption", { replace: true }); // redirect to admin page
    } else {
      alert("Incorrect password. Try again.");
    }
  };

  return (


   <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
              <h1 className="text-lg font-semibold">Admin check</h1> 
            </div>
            <hr />
          </div>
    
          <FullScreenLoader loading={loading2}
      message=" loading..."/>
        

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div>
          {(!show) &&(<p>are you admin?</p>)}
         <button onClick={()=> fetchChecking()}
          className="border border-gray-400 p-4 rounded bg-gray-200">
            {show ? "Refresh Page" :  "YES , Im admin"}
            </button>
       </div>

       {/* <button
       onClick={check_test}
       >jasdkfdk</button> */}
      
      <div className="bg-white p-6 rounded shadow-md w-80 mt-5 ">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter Admin Password @try 12345
        </label>
       {show &&( <input
          type="password"
          id="password"
          value={input }
          onChange={(e) => setInput (e.target.value)}
          placeholder="Enter password"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-4"
        />)}
        <button
          onClick={handlePassword}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading2?"Loading...":"__Go__@_Now_"}
        </button>
      </div>
    </div>

    </div >
    
  );
}

export default AdminPassword;

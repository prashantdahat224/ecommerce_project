import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../supabaseClient";
import { setUserData } from "../redux/userDataSlice";
import back from "../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
import ProccesMessages from "../components/ProccesMessages";
import { API_URL } from "../config/api";




const EditProfile = () => {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const reduxUserData = useSelector((state) => state.userData);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
 // const [message, setMessage] = useState("");

  const hasFetched = useRef(false);

    const navigate = useNavigate();

     const [cartMessage, setCartMessage] = useState(false);//added
    const [message, setMessage] = useState("");//added
    const [icon_show_now, setIcon_show_now] = useState(false);//added
    


  // const loadProfile = async () => {
  //   setLoading(true);

  //   // 1️⃣ Use Redux if available
  //   if (reduxUserData?.name && reduxUserData?.number) {
  //     setName(reduxUserData.name);
  //     setNumber(reduxUserData.number);
  //     setLoading(false);
  //     return;
  //   }

  //   // 2️⃣ Else fetch from Supabase
  //   const { data, error } = await supabase
  //     .from("profiles")
  //     .select("name, number")
  //     .eq("user_id", authUser.id)
  //     .single();

  //   if (!error && data) {
  //     setName(data.name || "");
  //     setNumber(data.number || "");

  //     dispatch(
  //       setUserData({
  //         name: data.name,
  //         number: data.number,
  //       })
  //     );
  //   }

  //   setLoading(false);
  // };
const loadProfile = async () => {
  setLoading(true);

  if (reduxUserData?.name && reduxUserData?.number) {
    setName(reduxUserData.name);
    setNumber(reduxUserData.number);
    setLoading(false);
    return;
  }

  const response = await fetch(`${API_URL}/get-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: authUser.id }),
  });

  const result = await response.json();

  if (!result.error && result.name) {
    setName(result.name);
    setNumber(result.number);

    dispatch(setUserData({ name: result.name, number: result.number }));
  }

  setLoading(false);
};





  useEffect(() => {
    if (!authUser || hasFetched.current) return;

    hasFetched.current = true;
    loadProfile();
  }, []); // 👈 runs once

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    );
  }

  // const handleSave = async () => {
  //   setSaving(true);

  //   if (!name.trim()) {
  //     setSaving(false);
  //      alert("Name cannot be empty");
  //      return; }
  //   if (!number.trim()) {
  //     setSaving(false); 
  //     alert("Number cannot be empty");
  //      return; }
  //   if (isNaN(number)) { 
  //     setSaving(false);
  //     alert("Number must be numeric");
  //      return; }

  //   const {error}=await supabase
  //     .from("users")
  //     .update( { name, number} )
  //     .eq("id",authUser.id);

  //     if(error){console.log("error",error)}
  //    // else {setMessage("Details saved successfully")}
  //   dispatch(setUserData({ name, number }));
  //    setMessage("Details saved successfully");
  //     setCartMessage(true);
  //   setSaving(false);
  // };
const handleSave = async () => {
  setSaving(true);

  if (!name.trim()) {
    setSaving(false);
    alert("Name cannot be empty");
    return;
  }
  if (!number.trim()) {
    setSaving(false);
    alert("Number cannot be empty");
    return;
  }
  if (isNaN(number)) {
    setSaving(false);
    alert("Number must be numeric");
    return;
  }

  const response = await fetch(`${API_URL}/edit-profile-new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: authUser.id, name, number }),
  });

  const result = await response.json();

  if (result.error) {
    console.log("error", result.error);
  } else {
    dispatch(setUserData({ name, number }));
    setMessage("Details saved successfully");
    setCartMessage(true);
  }

  setSaving(false);
};



  return (

   <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Edit profile </h1>

            </div>
            <hr />
          </div>
 
    <div className="p-4 space-y-4 max-w-md mx-auto">
       
       <div>
       <p className="text-gray-600">Enter your name</p>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        maxLength={40}
      />
      </div>

        <div>
           <p className="text-gray-600">Enter your phone number</p>
      <input
        type="number"
        placeholder="Enter Your Phone Number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className="w-full border rounded px-3 py-2"
        max="25"
      />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>

     <div>

     <ProccesMessages
                   show={cartMessage}
                   message={message}
                   icon_show={icon_show_now}
                   onClose={() => setCartMessage(false)}
                 />
      {/* {message && <p className="border border-gray-400 p-2 mt-4 mx-4 text-sm text-blue-500 rouded">{message}</p>} */}
    
     </div>
    </div>
  );
};

export default EditProfile;
import { useState } from "react";
import { supabase } from "../../supabaseClient"; // your Supabase client
import { useSelector } from "react-redux";
import FullScreenLoader from "../../utils/FullScreenLoader"; 
import back from "../../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";



export default function UploadNewOfferPoster() {

    const { isAdmin, loading_two } = useSelector(state => state.admin);

  const [posterName, setPosterName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleClick_and_check = ()=>{
    if (loading_two){
      alert("please wait");
      return;
    }
    if(isAdmin){
      handleUpload();
    }else{
      alert("not admin found");
    }
  }

  const handleUpload = async () => {
    if (!posterName || !file) {
      alert("Please provide both name and image.");
      return;
    }

    setLoading(true);

    // Generate a unique filepath
    const filePath = `${Date.now()}-${file.name}`;
 
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("offers")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Image upload failed.");
      setLoading(false);
      return;
    }

    // Insert into offers table (store only filepath)
    const { error: insertError } = await supabase
      .from("offers")
      .insert([{ name: posterName, image_url: filePath }]);

    if (insertError) {
      console.error(insertError);
      alert("Failed to save offer.");
    } else {
      alert("Offer uploaded successfully!");
      setPosterName("");
      setFile(null);
      setPreview(null); 
    }

    setLoading(false);
  };

  return (
    <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> new offer poster upload </h1>
            </div>
            <hr />
          </div>
  <FullScreenLoader loading={loading}
      message=" loading..."/>
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter poster name"
        value={posterName}
        onChange={(e) => setPosterName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={() => document.getElementById("fileInput").click()}
        className="border border-blue-500 text-blue-500 px-4 py-2 rounded mb-4"
      >
        Choose Image
      </button>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

     

     
    </div>
   <hr className="mx-2"></hr>
   <div className="flex flex-col items-center  ">
   
     <button 
        onClick={handleClick_and_check}
        disabled={loading}
        className="border border-blue-500 text-blue-500 px-4 py-2 rounded mb-4 mt-5  "
      >
        {loading ? "Uploading..." : "Upload Offer"}
      </button>

      </div >
      </div>

  );
}

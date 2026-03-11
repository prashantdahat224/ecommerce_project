import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { supabase } from "../../supabaseClient";
import { useRef } from "react";

 import FullScreenLoader from "../../utils/FullScreenLoader"; 
import back from "../../assets/icon_download_back.png";
 


export default function EditDetailsOfferNew() {
  const { posterId } = useParams();
  const navigate = useNavigate();

    const { isAdmin, loading_two } = useSelector(state => state.admin);


  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [productCode, setProductCode] = useState("");

  const [priorityScore, setPriorityScore] = useState("");
  const fileInputRef = useRef(null);


  useEffect(() => {
    fetchOffer();
  }, [posterId]);

  const fetchOffer = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("offers")
      .select("*")      //, products(product_code)
      .eq("id", posterId)
      .single();

          console.log(data);


    if (!error && data) {


       setOffer(data);
      setProductCode(data.product_code || "");
      setPriorityScore(data.priority_score || "");

  
      if(data.image_url){const { data: urlData } = supabase.storage
       .from("offers")
       .getPublicUrl(data.image_url);
      
      setOffer((prev) => ({
         ...prev,
          public_image_url: urlData.publicUrl,
            }));}

   setLoading(false);
 
    }
    console.log(offer);
    setLoading(false);
  };

  // DELETE IMAGE
//   const handleDeleteImage = async () => {
//      console.log("1",!offer?.image_url);
//     setLoading(true);
//     if (!offer?.image_url) return;
    

//    // const filePath = offer.image_url.split("/offers/")[1];
//    const filePath = offer.image_url;

//     console.log("2",filePath);

//     const { error } =
//     await supabase.storage.from("offers").remove([filePath]);

//     console.log("storageError",error);

//    if(!error){ await supabase
//       .from("offers")
//       .update({ image_url: null })
//       .eq("id", posterId);
// }
    
//     fetchOffer();
//     setLoading(false);
//   };
const handleDeleteImage = async () => {
  {console.log(offer);}
  if (!offer?.image_url) return;

  setLoading(true);

  const filePath = offer.image_url; // e.g. "1708450000000-banner.jpg"  
  console.log("Deleting:", filePath);

  const { error:storageError } = await supabase.storage
    .from("offers") // bucket name
    .remove([filePath]); // must match exactly


    await supabase
      .from("offers")
      .update({ image_url: null })
      .eq("id", posterId);

   
    // console.log("Deleting:", image_url);

  
    fetchOffer();
  setLoading(false);
};


  // SELECT IMAGE
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // UPLOAD IMAGE
  const handleUploadImage = async () => {
    if (!selectedImage) return;

      const fileName = `${Date.now()}-${file.name}`;


    const { error } = await supabase.storage
      .from("offers")
      .upload(fileName, selectedImage, { upsert: true });

    if (!error) {

       

      await supabase
        .from("offers")
        .update({ image_url: fileName  })
        .eq("id", posterId);

      setSelectedImage(null);
      setPreview(null);
      fetchOffer();
    }
  };

 
 
  // SAVE PRODUCT CODE
  const handleSaveProductCode = async () => {
    if(productCode ==="") {
      alert("enter any product code");
      return;}
    setLoading(true);
    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("product_code", productCode)
      .single();

    if (!product) {
          setLoading(false);

      alert("Product not found");
      return;
    }

    await supabase
      .from("offers")
      .update({ product_id: product.id,product_code : productCode})
      .eq("id", posterId);

          setLoading(false);

    fetchOffer();
  };

  // SAVE PRIORITY SCORE
  const handleSavePriority = async () => {
    await supabase
      .from("offers")
      .update({ priority_score: priorityScore })
      .eq("id", posterId);

    fetchOffer();
  };
  const handleDeleteOffer = async () => {
     if (!offer) return;
     setLoading(true);
     handleDeleteImage();
     const { error: dbError } = await supabase 
     .from("offers")
      .delete()
      .eq("id", posterId);

      if (dbError)
         {
          setLoading(false);
          console.error("Row delete failed:", dbError.message); 
          alert("Failed to delete offer.");
         }

         else {
          setLoading(false);
           alert("Offer deleted successfully!"); 
           navigate(-1);
         }
           // redirect to offers list or wherever you want }
     setLoading(false);
  };





  if (loading) return <div className="p-4">Loading...</div>;

  if (loading_two) return <div className="p-4">admin checking...</div>;

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
 <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Page name </h1>
                           <button
          onClick={fetchOffer}
           className="bg-gray-200 p-1 rounded">Refresh</button>
            </div>

              
            <hr />
          </div>
  <FullScreenLoader loading={loading}
      message=" loading..."/>


    <div className="p-4 max-w-md mx-auto space-y-6">

      {/* IMAGE SECTION */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Offer Image</h2>

        {offer?.public_image_url && (
          <div className="relative">
            <img
              src={offer.public_image_url}
              alt="offer"
              className="w-40 h-30 object-cover rounded"
            />
            <button
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 border border-red-500 text-red-500 px-3 py-1 rounded-lg text-sm"
            >
              Delete image
            </button>
          </div>
        )}

        

         
        

          {/* Preview */}
  {preview && (
    <img
      src={preview}
      alt="preview"
      className="w-40 h-30 rounded object-cover border "
    />
  )}

  {/* Hidden File Input */}
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleSelectImage}
    className="hidden"
  />

  {/* Choose Image Button */}
  {(offer?.image_url) && (<button
    onClick={() => fileInputRef.current.click()}
    className="w-full bg-gray-200 py-3 rounded-xl font-medium active:scale-95 transition"
  >
    Choose Image
  </button>)}





      {!(offer?.image_url)&&(  <button
          onClick={handleUploadImage}
          className="w-full border border-black text-black py-2 rounded-xl"
        >
          Upload Image
        </button>)}


      </div>

      {/* PRODUCT CODE */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Product Code</h2>
        <h2 className=" ">product code - link offer poster to product</h2>
        <h2 className=" ">Product Code exiting : {offer.product_code || "not exist"}</h2>
           
        <input
          type="text"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          className="w-full border p-2 rounded-xl"
          placeholder="Enter product code"
        />

        <button
          onClick={handleSaveProductCode}
          className="w-full border border-blue-600 text-blue-600 py-2 rounded-xl"
        >
          Save Product
        </button>

        {offer?.product_id && (
          <button
            onClick={() =>  navigate(`/admin_only/SearchProductID/${offer.product_id }`)}
            className="w-full bg-gray-300 text-black py-2 rounded-xl"
          >
            Go To Product
          </button>
        )}
      </div>

      {/* PRIORITY SCORE */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Priority Score</h2>
        <h2 className=" ">Priority Score exiting : {offer.priority_score || "not exist"}</h2>


        <input
          type="number"
          value={priorityScore}
          onChange={(e) => setPriorityScore(e.target.value)}
          className="w-full border p-2 rounded-xl"
          placeholder="Enter priority"
        />

        <button
          onClick={handleSavePriority}
          className="w-full border border-blue-600 text-blue-600 py-2 rounded-xl"
        >
          Save Priority
        </button>
      </div>

      <button
      onClick={handleDeleteOffer}
      className="mt-4 border border-red-500 p-1 text-red-500 rounded">delete offer poster</button>
    </div>
      </div >

  );
}
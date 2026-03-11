import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // your Supabase client
 
import back from "../../assets/icon_download_back.png";
import { useNavigate } from "react-router-dom";
 import FullScreenLoader from "../../utils/FullScreenLoader"; 


export default function OfferUploadNew() {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);



   const fetchOffers = async () => {
    setLoading(true);
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("priority_score", { ascending: true });

      if (error) {
        console.error("Error fetching offers:", error.message);
      } else {
        // Convert image_url to public URL if using Supabase storage
        const offersWithUrls = data.map((offer) => {
          let imageUrl = offer.image_url || "";
          if (imageUrl) {
            const { data: urlData } = supabase.storage
              .from("offers")
              .getPublicUrl(imageUrl);
            imageUrl = urlData.publicUrl;
          }
          return { ...offer, public_url: imageUrl };
        });
        setOffers(offersWithUrls);
      }
          setLoading(false);

        
    };
  useEffect(() => {
   

    fetchOffers();
  }, []);

  return (

     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Offer poster </h1>
                             <button
          onClick={fetchOffers}
           className="bg-gray-200 p-1 rounded">Refresh</button>
            </div>
            <hr/>
          </div>

           <FullScreenLoader loading={loading}
      message=" loading..."/>

    <div >
      <div className="grid grid-cols-2 gap-6 p-6">
      {offers.map((offer) => (
        <div
          key={offer.id}
          onClick={() => navigate(`/admin_only/new-offer-upload/${offer.id}`)}
          className="cursor-pointer border rounded-lg shadow  transition"
        >
          <img
            src={offer.public_url}
            alt={offer.name}
            className="w-full h-20 object-cover rounded-t-lg"
          />
          <p className="text-center py-2 font-semibold">{offer.name}</p>
          <p className="text-sm  p-1"> priority score : {offer.priority_score}</p>
        </div>
      ))}
      </div>

      <hr className="mt-5"></hr>
      <button 
      onClick={()=> navigate("/admin_only/UploadNewOfferPoster")}
      className=" bg-gray-200 p-2 mt-4 ml-5 text-black rounded">create new offer poster</button>
    </div>

      </div > 
  );
}

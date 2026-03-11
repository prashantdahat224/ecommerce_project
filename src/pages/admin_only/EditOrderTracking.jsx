import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
 import back from "../../assets/icon_download_back.png";
 import { supabase } from "../../supabaseClient";
 
 
export default function EditOrderTracking() {
  const {orderId} = useParams()
  const navigate = useNavigate()

  const [updates, setUpdates] = useState("")
  const [updatesTime, setUpdatesTime] = useState("")

  const [updates_current, setUpdates_current] = useState([])
 
  const [loading, setLoading] = useState(false)

  

  // Fetch existing data
  useEffect(() => {
    fetchOrderTrack()
  }, [])

  const fetchOrderTrack = async () => {
    const { data, error } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("order_id", orderId)
      .order("updates_time", { ascending: false });       

    if (error) {
      console.error(error)
      return
    }
      
    if(data){
    setUpdates_current(data)
    }
    //setUpdatesTime_current(data.updates_times?.slice(0, 16)) // format for datetime-local
  }

  const getCurrentDate = ()=>{
    const now = new Date();  
    return now.toISOString().slice(0, 16);
    
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)


    const formatted = updatesTime.replace("T", " ") + ":00";
    console.log("formatted",formatted);
    // const { data,error } = await supabase
    //   .from("order_tracking")
    //   .update({
    //     updates: updates,
    //     updates_time: updatesTime,
    //   })
    //   .eq("id", orderId)
    const { data, error } = await supabase
  .from("order_tracking")
  .insert([
    {
      order_id: orderId,        // your custom order identifier
      updates: updates,         // text or JSON field
      updates_time: formatted // timestamp or string
    },
  ]);

if (error) {
  console.error("Insert error:", error);
} else {
  console.log("Inserted row:", data);
}


    setLoading(false)

    if (error) {
      alert("Error updating record")
      console.error(error)
    } else {
      alert("Updated successfully")
      fetchOrderTrack();
      console.log("data",data);
    //  navigate("/orders") // redirect
    }
  }

  return (
     <div>
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2 ml-4 p-1">
              <img src={back} className="h-10 w-10" onClick={() => navigate(-1)} />
                           <h1 className="text-lg font-semibold"> Page name </h1>
                           <button
          onClick={fetchOrderTrack}
           className="bg-gray-200 p-1 rounded">Refresh</button> 

             
            </div>
            <hr />
          </div>
          
    <div className="flex-col bg-gray-100 flex items-center justify-center p-6">
          
      <div className="my-5 ">
       {console.log(updates_current)}
      <div className="my-5">
      <p className="text-lg">curent order tracking -</p> 
      {updates_current?.map((item) => (
        <div className="border border-black p-2 mt-2" key={item.id}>
             {console.log(item)}
          <div> upadate:  {item.updates || "not found"}</div>
          <div> time: {item?.updates_time.replace("T"," ") || "not found"}</div>
         
        </div>
        
      ))}
      </div>
 
    
   
      

       </div>

       

      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">
          upload Order Tracking
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Update Message
            </label>
            <textarea
              value={updates}
              onChange={(e) => setUpdates(e.target.value)}
              className="w-full border rounded-lg p-2   "
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Update Time
            </label>
            <input
              type="datetime-local"
              value={updatesTime || getCurrentDate()}
              onChange={(e) => setUpdatesTime(e.target.value)}
              className="w-full border rounded-lg p-2"
             // placeholder="pick and time"
              
              required
            />
            
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg"
          >
            {loading ? "Please wait..." : "Update Order"}
          </button>
        </form>

        
      </div>

        </div>
    </div > 
  )
}

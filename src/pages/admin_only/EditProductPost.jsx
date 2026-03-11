import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import back from "../../assets/icon_download_back.png";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";




export default function EditProductPosts() {



  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [goBack, setGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     const [item_name, setItem_name] = useState(null);
  const [item_id, setItem_id] = useState(null);
 const [score, setScore] = useState("");
 const [message, setMessage] = useState("");


   const [sortBy, setSortBy] =  useState("priority_score");

// const sortedProducts = sortProducts(products, sortBy);

        
    const fetchProducts = async () => {
      
      setLoading(true);  //added
      const { data, error } = await supabase
        .from("products")
        .select("id,name,product_image,product_code,priority_score,clicks_count,created_date,price")
        .limit(40);
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      console.log("Fetched products:", data);

      // Convert stored paths to public URLs
      const productsWithUrls = data.map((p) => {
        let publicUrl = "";
        if (p.product_image) {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(p.product_image);
          publicUrl = urlData.publicUrl;
        }
        return { ...p, product_image: publicUrl };
      });

      setProducts(productsWithUrls);

      setLoading(false);  //added
    };

  useEffect(() => {
  
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.product_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category_of_product || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.priority_score || "").toString().includes(search.toLowerCase()) 
  );
// Apply sorting on the filtered list
const sorted = [...filtered].sort((a, b) => {
  switch (sortBy) {
    case "price_low_high":
      return a.price - b.price; // ascending
    case "price_high_low":
      return b.price - a.price; // descending
    case "priority_score":
      return b.priority_score - a.priority_score; // higher first
    case "popularity":
      return b.clicks_count - a.clicks_count; // higher first
    case "newest":
      return new Date(b.created_date) - new Date(a.created_date); // newest first
    default:
      return 0;
  }
});


   
   const handleEditsScoreClick = (id,name,score) => {
    setMessage("");
    if (id && name && score !== undefined && score !== null ) {
       setItem_id(id);
       setItem_name(name);
       setScore(score);
    }else{
      alert("something went wrong!")
    }
  };

   const handleScore = (id) => {
    
    if(!item_id && !item_name){
      alert("no item selected")
      return;
    }

    if (!isNaN(score) && score ) {
      const number_s = Number(score);
      ChangeScoreCount(number_s,id);
    }else{
      alert("number required!")
    }
  };

  const ChangeScoreCount = async (number_s =0,id) => {

    setLoading(true);

    const { data, error } = await supabase.from("products")
    .update({ priority_score: number_s })
    .eq("id",id);
    console.log("score updated:", data);
    console.log("error score updated:", error);
    if (error) {
      setLoading(false);
       setLoading(false);
       setItem_id(null);
       setItem_name(null);
       alert("score update failed!");
        
    } 
    if (!error) {
    setItem_id(null);
    setItem_name(null);
    fetchProducts();
    setLoading(false);
    setScore("");
    setMessage("score count changed!");
    }
    setItem_id(null);
    setItem_name(null);
     setLoading(false);
   // setMessage("");
  };


  return (
    <div>

      <div className="sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-2  my-2 ml-4">
          <img
            src={back}
            alt="Back"
            className="h-10 w-10"
             onClick={() => navigate(-1)} 
          />
          <p className="text-left text-lg font-medium text-gray-900">
          Edit Product Posts</p>
            <button
          onClick={fetchProducts}
           className="bg-gray-200 p-1 rounded">Refresh</button>
        </div>
        <hr className="border-gray-300" />
      </div>

      <div className="p-4">

         {/* edit score */}
          
        <div className=" border   p-2 mt-2">
          <p >{item_name || "no item selected"}</p>
           <input
                   type="number"
                   value={score} onChange={(e) => setScore(e.target.value)}
                   placeholder="Enter scroe number"
                   className=" border border-black p-1  placeholder-gray-500" />
                    
                 <button

                onClick={()=>handleScore(item_id)}
                className="ml-3   px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                save score
              </button>

              {message && <p className="text-sm ">result : {message} succesfully</p>}
         </div>

         

         
         {/* edit score */}
          

        <h1 className="text-xl font-bold mb-4 mt-2">Edit Product Posts</h1>

        {/* Search */}
         
        <input
          type="text"
          placeholder="Search by name,product code,category,score"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />


      

 
    <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="  w-50 md:w-64 px-3 py-2 border rounded"
>
  
  <option value="price_low_high">Price - Low to High</option>
  <option value="price_high_low">Price - High to Low</option>
  <option value="priority_score">Priority Score</option>
  <option value="popularity">Popularity</option>
  <option value="newest">Newest</option>
</select>


    {/* <ul>
      {sortedProducts.map((product) => (
        <li key={product.id}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul> */}
 


         {loading && (
          <p className="text-center text-gray-500 font-medium my-4">Loading...</p>
        )}


        {/* Product List */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-4">
          {sorted.map((product) => (
            <div className="border rounded " key={product.id} >
              <div  className="p-2 " onClick={() => navigate(`/admin_only/EditProductDetails/${product.id}`)}>
                {product.product_image ? (
                  <img
                    src={product.product_image}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500">
                    No Image
                  </div>  
                )}
                <h2 className="text-sm font-semibold mt-2">{product.name}</h2>
                <p className="text-xs text-gray-500">{product.product_code}</p>
                 <p className="text-sm text-gray-500 mt-1">clicks_count: {product.clicks_count || "not found"}</p>
                 </div>

                <div className="mt-1  pt-1">
                <div className="border-t border-gray-400 p-1" >
               <p className="text-sm text-gray-500">priority_score:</p>
                <p className="text-sm text-gray-500"> {product.priority_score || "0"}</p>
                  <button 
                   onClick={()=>{handleEditsScoreClick(product.id,product.product_code,product.priority_score)}}
                   className="bg-gray-200 p-1">select for edit</button> 
                </div>
                </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

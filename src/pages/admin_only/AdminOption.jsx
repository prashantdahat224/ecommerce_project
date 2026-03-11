import { useNavigate } from "react-router-dom";
//checked / database

function AdminOption() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-xl font-bold mt-4 mb-6">_choose_a_Page_for_EDIT_</h1>

      <button
        onClick={() => navigate("/admin_only/OfferUploadNew") }
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Offers Poster
      </button>

      <button
        onClick={() => navigate("/admin_only/ProductPostUpload")}
        className="w-40 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
      >
        Product Post UPLOAD
      </button>

      <button
        onClick={() => navigate("/admin_only/EditProductPost")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
         EDIT the existing product post
      </button>

      <button
        onClick={() => navigate("/admin_only/AdminProductSearch")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        DELETE the Product Post
      </button>

      

      <button
        onClick={() => navigate("/admin_only/manage_category")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage category 
      </button>

      <button
        onClick={() => navigate("/admin_only/ManageKeywords")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage keywords 
      </button>
      <button
        onClick={() => navigate("/admin_only/ManageTrendingKeywords")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage trending keywords 
      </button>
      <button
        onClick={() => navigate("/admin_only/EditOrder")}
        className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        manage ORDERS 
      </button>
      
       

      <button
        onClick={() => navigate("/Account")}
        className="border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       go BACK
      </button>
      <button
        onClick={() => navigate("/home")}
        className="border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       go back to HOME
      </button>

      {/* <button
      // onClick={() => navigate("/TestingPage")}
        className="border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       admin GUIDE
      </button> */}
      <button
        onClick={() => navigate("/admin_only/AdminProfilePassword")}                        
        className="mb-20 border border-blue-600 w-40 bg-gray-100 text-blue-600 py-2 rounded-md hover:bg-gray-200"
      >
       Admin Profile Page
      </button>
    </div>
  );
}

export default AdminOption;

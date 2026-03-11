import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
 console.log("initailize");
  const { isAdmin } = useSelector(state => state.admin);
      console.log("isAdmin",isAdmin);
 // if (loading) return <div>Checking admin...</div>;
   // if (!isAdmin){  
  //     return <Navigate to="/AskUs" replace />;
  //   }

  return isAdmin ? <Outlet /> : <Navigate to="/AskUs" replace />;
}
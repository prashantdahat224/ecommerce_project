import React from "react";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"; //BrowserRouter as Router//added

import { useEffect } from 'react'; //added
import { supabase } from './supabaseClient'; //added

import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./redux/authSlice";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";



import Home from "./pages/Home";
import Account from "./pages/Account";
import EmailLogin from "./pages/EmailLogin";
import EmailRegistration from "./pages/EmailRegistration";
import TestingPage from "./pages/TestingPage";
import EditProfile from "./pages/EditProfile";
import ProductPostUpload from "./pages/admin_only/ProductPostUpload";
                                               
import ProductDetails from "./pages/ProductDetails";
import EditProductPosts from "./pages/admin_only/EditProductPost";
import EditProductDetails from "./pages/admin_only/EditProductDetails";

 
import Settings from "./pages/Settings";
import LogOut  from "./pages/logOut";
import LogOutButton  from "./pages/logOutButton";


import AdminProductSearch from "./pages/admin_only/AdminProductSearch";
import DeleteProductPost from "./pages/admin_only/DeleteProductPost";
import Search from "./pages/Search"
import WishListPage from "./pages/WishListPage";
 import Manage_category from "./pages/admin_only/Manage_category";
import ManageKeywords from "./pages/admin_only/ManageKeywords";
import ManageImageCategory from "./pages/admin_only/ManageImageCategory";
import ManageTrendingKeywords from "./pages/admin_only/ManageTrendingKeywords";
import SearchProductID from "./pages/admin_only/SearchProductID";
import OfferUploadNew from "./pages/admin_only/OfferUploadNew";
import EditDetailsOfferNew from "./pages/admin_only/EditDetailsOfferNew";
import UploadNewOfferPoster from "./pages/admin_only/UploadNewOfferPoster";

import CategoryProducts from "./pages/Extra/CategoryProducts";
import AdminDetailsPage from "./pages/admin_only/AdminDetailsPage";
import AdminSelect from "./pages/admin_only/AdminSelect";
import HelpCenterPage from "./pages/HelpCenterPage";
import CategoriesPage from "./pages/CategoriesPage";
import OrdersPage from "./pages/OrdersPage";
import AskUs from "./pages/AskUs";
 
import EditKeywordAndCategory from "./pages/admin_only/EditKeywordAndCategory";
import AdminProfilePassword from "./pages/admin_only/AdminProfilePassword";
import EditOrder from "./pages/admin_only/EditOrders";
import EditOrderDetailsPage from "./pages/admin_only/EditOrdeDetailsPage";
import EditOrderTracking from "./pages/admin_only/EditOrderTracking";
import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./pages/OrderTracking";
import ProductCartNew from "./pages/ProductCartNew";
import ProductWhishList from "./pages/ProductWhishList";
import { fetchWishlist } from "./redux/wishlistSlice";

import ImagePage from "./pages/ImagePage";
import AdminOption from "./pages/admin_only/AdminOption";
import AdminPassword from "./pages/AdminPassword";

 

 
function App() {

      const dispatch = useDispatch();

      
      /////////////////
  //     useEffect(() => {
  //   // Get current session
  //   supabase.auth.getSession().then(({ data }) => {
  //     dispatch(setUser(data?.session?.user || null));
  //   });

  //   // Listen auth changes
  //   const { data: listener } = supabase.auth.onAuthStateChange(
  //     (_event, session) => {
  //       if (session?.user) {
  //         dispatch(setUser(session.user));
  //          dispatch(fetchWishlist(session.user.id)); //added
  //       } else {
  //         dispatch(clearUser());
  //       }
  //     }
  //   );

  //   return () => listener.subscription.unsubscribe();
  // }, []);
        useEffect(() => {
  let mounted = true;

  supabase.auth.getSession().then(({ data }) => {
    if (!mounted) return;

    dispatch(setUser(data?.session?.user || null));

    if (data?.session?.user) {
      dispatch(fetchWishlist(data.session.user.id));
    }
  });

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        dispatch(setUser(session.user));
        dispatch(fetchWishlist(session.user.id));
      } else {
        dispatch(clearUser());
      }
    }
  );

  return () => {
    mounted = false;
    listener.subscription.unsubscribe();
  };
}, []);

      /////////////////

    

  return (
    
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/home/*" element={<Home />} /> 
     <Route path="/" element={<Home />} /> 
        <Route path="/Search" element={<Search />} /> 

      <Route path="/product/:id" element={<ProductDetails />} >
          
     </Route>

    <Route path="/image-page" element={<ImagePage />} />
         {/* /:imageUrl */}
     <Route path="/product/:id" element={<ProductDetails />} ></Route>
     <Route path="/HelpCenterPage" element={<HelpCenterPage />} />
      <Route path="/CategoriesPage" element={<CategoriesPage />} />
      <Route path="/ProductCartNew" element={<ProductCartNew />} />
      <Route path="/ProductWhishList" element={<ProductWhishList />} />
      <Route path="/OrdersPage" element={<OrdersPage />} />
      <Route path="/AskUs" element={<AskUs />} />    
      <Route path="/account" element={

      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
     
        
        } /> 
 
      <Route path="/admin_only" element={<AdminRoute />}>
 
              
       <Route index element={<TestingPage />} />
       <Route path="Manage_category" element={<Manage_category />} />
      <Route path="editKeywordAndCategory/:productId" element={<EditKeywordAndCategory />} /> 
     <Route path="new-offer-upload/:posterId" element={<EditDetailsOfferNew />} /> 
      <Route path="ManageKeywords" element={<ManageKeywords />} />
      <Route path="AdminProfilePassword" element={<AdminProfilePassword />} />
      <Route path="EditOrder" element={<EditOrder />} />
      <Route path="UploadNewOfferPoster" element={<UploadNewOfferPoster />} />
      <Route path="ManageImageCategory/:productId" element={<ManageImageCategory />} />
      <Route path="ManageTrendingKeywords" element={<ManageTrendingKeywords />} />
      <Route path="SearchProductID/:productIds" element={<SearchProductID />} />
      <Route path="OfferUploadNew" element={<OfferUploadNew />} />
      <Route path="AdminDetailsPage" element={<AdminDetailsPage />} />
      <Route path="AdminSelect" element={<AdminSelect />} />

 
       <Route path="ProductPostUpload" element={<ProductPostUpload />} />
      <Route path="EditProductPost" element={<EditProductPosts />} /> 
      <Route path="AdminProductSearch" element={<AdminProductSearch />} /> 
      {/* <Route path="edit-products" element={<EditProductPosts />} />   */}
      <Route path="EditProductDetails/:id" element={<EditProductDetails />} />
      <Route path="EditOrderDetailsPage/:orderId" element={<EditOrderDetailsPage />} />
      <Route path="EditOrderTracking/:orderId" element={<EditOrderTracking />} />
      <Route path="delete-product/:id" element={<DeleteProductPost />} />
      <Route path="AdminOption" element={<AdminOption />} />
 
      </Route>
      
     
      <Route path="/CategoryProducts/:categoryId" element={<CategoryProducts />} />


        



      <Route path="/EmailLogin" element={<EmailLogin />} /> 
      <Route path="/EmailRegistration" element={<EmailRegistration />} /> 
     
      <Route path="/AdminPassword/:id" element={<AdminPassword />} /> 

      <Route path="/Settings" element={<Settings />} />
      <Route path="/logOut" element={<LogOut />} />
      <Route path="/logOutButton" element={<LogOutButton />} />
 
      <Route path="/EditProfile" element={<EditProfile />} />
      <Route path="/OrderDetails/:orderId" element={<OrderDetails />} />
      <Route path="/OrderTracking/:orderId" element={<OrderTracking />} />
  
       <Route path="/wishlist" element={<WishListPage />} />

          
      
       
  
 
    </Routes>
  );
}

export default App;

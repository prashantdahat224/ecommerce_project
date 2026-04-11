//  /functions/api/handler.js

const addToCartTwo = require("./routes/add-to-cart-two");
const addToCart = require("./routes/add-to-cart");
const categories = require("./routes/categories");
const categoryProducts = require("./routes/category-products");
const checkAdminRole = require("./routes/check-admin-role");
const checkAdmin = require("./routes/check-admin");
const createOrder = require("./routes/create-order");
const getAdminCheck = require("./routes/get-admin-check");
const getAdminPhoneTwo = require("./routes/get-admin-phone-two");
const getAdminPhone = require("./routes/get-admin-phone");
const getAllCategories = require("./routes/get-all-categories");
const getOffers = require("./routes/get-offers");
const getOrderDetails = require("./routes/get-order-details");
const getOrderTracking = require("./routes/get-order-tracking");
const getProductById = require("./routes/get-product-by-id");
const getUserOrders = require("./routes/get-user-orders");
const getUserProfile = require("./routes/get-user-profile");
const homeIndex = require("./routes/index");
const productPreview = require("./routes/product-preview");
const products = require("./routes/products");
const searchProducts = require("./routes/search-products");
const searchSuggestions = require("./routes/search-suggestions");
const trendingKeywords = require("./routes/trending-keywords");
const register = require("./routes/register-user");
const login = require("./routes/login-user");
const session = require("./routes/session-check");
 const editProfile = require("./routes/edit-profile-new");
const getProfile = require("./routes/get-profile-new");
const helpCenter = require("./routes/help-center");
const logout = require("./routes/logout");
const productCart = require("./routes/product-cart-new");
const productWishlist = require("./routes/product-wishlist-new");
const wishlist = require("./routes/wishlist-new");
const homeData = require("./routes/home-data"); //   
const brand = require("./routes/brands"); //   
const brandsProduct = require("./routes/brand-products"); //   
const getBrandById = require("./routes/get-brand-by-id");



exports.handler = async (event) => {
  const path = event.rawPath || event.path;
    const method = event.httpMethod || event.requestContext?.http?.method; //  added

  // Global headers
  const headers = {
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Headers": "Content-Type",
    // Global headers
 
  "Access-Control-Allow-Origin": "https://www.wishmos.com", // or "*" for all
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",


  };
  // ✅ HANDLE PREFLIGHT
if (method === "OPTIONS") {
return {
statusCode: 200,
headers,
body: "",
};
}
   
  // Route mapping
  const routes = {
    "/add-to-cart-two": addToCartTwo,
    "/add-to-cart": addToCart,
    "/categories": categories,
    "/category-products": categoryProducts,
    "/check-admin-role": checkAdminRole,
    "/check-admin": checkAdmin,
    "/create-order": createOrder,
    "/get-admin-check": getAdminCheck,
    "/get-admin-phone-two": getAdminPhoneTwo,
    "/get-admin-phone": getAdminPhone,
    "/get-all-categories": getAllCategories,
    "/get-offers": getOffers,
    "/get-order-details": getOrderDetails,
    "/get-order-tracking": getOrderTracking,
    "/get-product-by-id": getProductById,
    "/get-user-orders": getUserOrders,
    "/get-user-profile": getUserProfile,
    "/product-preview": productPreview, // WhatsApp preview
    "/products": products,
    "/search-products": searchProducts,
    "/search-suggestions": searchSuggestions,
    "/trending-keywords": trendingKeywords,
      "/register-user": register,   // ✅ new route
        "/login": login,   // ✅ new login route
          "/session-check": session,    
           "/edit-profile-new": editProfile,
          "/get-profile-new": getProfile,
            "/help-center": helpCenter,
              "/logout": logout,
                "/product-cart": productCart,
                  "/product-wishlist-new": productWishlist,
                      "/wishlist": wishlist,
                       "/home-data": homeData,      
                       "/brands": brand,      
                       "/brand-products": brandsProduct,    
                       "/get-brand-by-id": getBrandById,  
      
    "/": homeIndex,
  };


  
  // Find matching route
  for (const route in routes) {
    if (path.startsWith(route)) {
      const response = await routes[route].handler(event);
      // Ensure headers are applied
      response.headers = { ...headers, ...(response.headers || {}) };
      return response;
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ message: "Route not found" }),
  };
};
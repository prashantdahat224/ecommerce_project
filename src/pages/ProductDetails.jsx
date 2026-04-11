import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";  //added
import { toggleWishlist } from "../redux/wishlistSlice"; //added

import { Outlet, useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
import share from "../assets/icon_account_share.png";
import icon_whish_list from "../assets/icons_account_heart.png";
import icon_whish_list_clicked from "../assets/icons_heart_black_for_card.png";

import Header2 from "../components/HeaderForBack";
import ImageSwiper from "../components/ImageSwiper"; // added
import ProductDetailsSkeleton from "../components/placeHolder/ProductDetailsPlaceholder";
import PurchaseNow from "../components/PurchaseNow"
import FullScreenLoader from "../utils/FullScreenLoader";
import LoginDialog from "../components/LoginDialog"
import ProccesMessages from "../components/ProccesMessages";
import ShareDialog_new from "../components/ShareDialog_new";
import { API_URL } from "../config/api";



export default function ProductDetails() {


  const { user, loading } = useSelector((state) => state.auth); //added
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  const [loading2, setLoading2] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [cartMessage, setCartMessage] = useState(false);//added
  const [message, setMessage] = useState("");//added
  const [icon_show_now, setIcon_show_now] = useState(false);//added

  const [brand, setBrand] = useState(null);


  const { id } = useParams(); // product id from route
  const [product, setProduct] = useState(null);
  const [purchaseOpen, setPurchaseOpen] = useState(true);
  const [whish_list_clicked, setWhish_list_clicked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [shareOpen_new, setShareOpen_new] = useState(false);


  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(id);



  //   const openFullImage = (index) => {
  //     //"/product/:id" 
  //     //`/product/${product.id}/image/${index}`
  //   navigate(`/product/${product.id}/image/${index}`);
  // };
  const openFullImage = (img) => {
    const imageUrl_new = img;
    console.log("entry", imageUrl_new)
    navigate("/image-page", { state: { selectedImage: imageUrl_new } });
  };



  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading2(true);

        const res = await fetch(
          `${API_URL}/get-product-by-id?id=${id}`
        );

        const data = await res.json();

        if (!data.error) {
          setProduct(data);
        }

      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading2(false);
      }
    };

    fetchProduct();

  }, [id]);
  
  useEffect(() => {
  if (!product?.brand_id) return;

  fetch(`${API_URL}/get-brand-by-id?id=${product.brand_id}`)
    .then(res => res.json())
    .then(data => {
      if (!data.error) setBrand(data);
    })
    .catch(err => console.error("Brand fetch error:", err));

}, [product]);

  if (!product) { return <div className="lg:mx-70"><ProductDetailsSkeleton /></div>; }
  

  // Collect images: featured first, then additional //
  const images = [product.featured_image_url, ...(product.additional_images_url || [])];




  //   const shareProduct = async ( ) => {
  //   if (navigator.share) {
  //     await navigator.share({
  //       title: product.name,
  //       text: product.about,
  //       url:`${product.featured_image}`,
  //     });
  //   } else {
  //     alert("Sharing not supported on this browser");
  //   }
  // };


  const handlePurchase = () => {
    if (!user) {

      setShowDialog(true)
    } else {
      setPurchaseOpen(false);
    }



  }


  const handleAddToCart = async () => {
    try {
      setLoading2(true);

      if (!user) {
        setShowDialog(true);
        setLoading2(false);
        return;
      }

      const res = await fetch(`${API_URL}/add-to-cart-two`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          productId: id
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        console.error("Add to cart error:", data.error);
        setMessage("Error adding to cart. Please refresh.");
        setCartMessage(true);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        setMessage("Product added to cart");
      } else {
        setMessage("Product already in cart");
      }

      setCartMessage(true);

    } catch (err) {
      console.error("Network error:", err);
      setMessage("Network error. Try again.");
      setIcon_show_now(true);
      setCartMessage(true);
    } finally {
      setLoading2(false);
    }
  };

  const addToWhishList = async () => {
    // setLoading2(true);

    if (!user.id) {
      setLoading2(false);
      setShowDialog(true)
      return;
    }
    // dispatch(
    //   toggleWishlist({
    //     userId: user.id,
    //     productId: id,
    //   })
    // );
    ///////////////////
    setMessage(
      isWishlisted
        ? "Product removed from wishlist"
        : "Product added to wishlist"
    );
    setCartMessage(true);

    dispatch(toggleWishlist({ userId: user.id, productId: id }))
      .then((action) => {
        if (action.meta.requestStatus === "rejected") {
          // If backend failed, show error
          setMessage("Error updating wishlist. Please refresh.");
          setIcon_show_now(false);
          setCartMessage(true);
        }
      });
    //////////////

    //    setLoading2(false);
  };



  return (

    <div className="flex flex-col min-h-screen bg-white font-sans  ">
      {/* Header (sticky) */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <Header2 />
      </header>

      <FullScreenLoader loading={loading2}//|| loading
        message=" loading..." />

      <ProccesMessages
        show={cartMessage}
        message={message}
        icon_show={icon_show_now}
        onClose={() => setCartMessage(false)}
      />



      <LoginDialog open={showDialog} onClose={() => setShowDialog(false)} />
      <ShareDialog_new
        isOpen={shareOpen_new}
        onClose={() => setShareOpen_new(false)}
        productName={product.name}
        productId={product.id}
      />


      {purchaseOpen ? (
        <div className="lg:mx-70">
          <div>
            {/* Image Slider */}

            <div className="relative ">
              {/* <ImageSwiper 
        images={images}
        onImageClick={openFullImage}
      />  */}
              <ImageSwiper images={images} onImageClick={openFullImage} />

              {/* Nested route renders here */}
              <Outlet context={{ images: images }} />

              {/* <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow">
          <img src={share} alt="share" className="w-6 h-6"
          onClick={sharePost} 
          />
         
        </button> */}
            </div>

            {/* Share/Wishlist Button */}
            <div className="flex gap-4 p-2 mt-4">
              <div className="flex flex-col items-center justify-center ">
                <div
                  onClick={addToWhishList}
                  className="border border-gray-300 p-2 rounded-full">

                  {(isWishlisted) ? (
                    <img src={icon_whish_list_clicked} alt="icon_w" className="h-5 w-5 " />
                  ) : (
                    <img src={icon_whish_list} alt="icon_w" className="h-5 w-5 " />
                  )}

                </div>
                <p className="text-gray-500 rounded text-sm">Add to Whish list</p>
              </div>
              <div className="flex flex-col items-center justify-center ml-4 ">
                <div
                  onClick={() => setShareOpen_new(true)}
                  className="border border-gray-300 p-2 rounded-full">
                  <img src={share} alt="icon_s" className="h-5 w-5" /></div>
                <p className="text-gray-500 rounded text-sm">Share</p>


              </div>
            </div>

            <hr className="border border-gray-200 mx-3" />

            {/* Product Info */}

            <div className="px-4 space-y-1 mt-4">



              <h1 className="text-base font-semibold tracking-wide">{product.name || ""}</h1>

              {/* <p className="text-xs uppercase tracking-widest text-gray-400">
          {product.about || "nike and jordan"}
        </p> */}

              <div className="flex items-center gap-2">

                {brand?.brand_image_url && ((<LazyImage
                  src={brand.brand_image_url}
                  alt={product?.name}
                  className="mt-3 w-20 h-20 rounded-full object-cover"
                />))}
                  
                {product.brand_name && (<div>
                <h1 className="  font-bold">
                  {product.brand_name || "not specified"}
                </h1>
                
                <h1 onClick={() => navigate(`/BrandsProducts/${product.brand_id}`, { replace: true })}
                  className=" font-semibold text-sm text-blue-500">explore more similar</h1>
                 </div>)}
                  
              </div>

              <p className="text-xl font-bold mt-4">
                {product.currency || "₹"}
                {product.price || "price not available"}
              </p>
              <p className="text-sm text-green-600">{product.stock || " "}</p>


              {(product.store_address || product.store_contact) && (

                <div>
                  <hr className="mt-3 border border-gray-200 " />

                  <p className=" mt-3 text-lg font-semibold text-black">Store details</p>
                  <div className="flex items-center gap-2">
                    <p className="  font-semibold  text-sm  ">Address</p>
                    <p className="   text-sm  ">{product.store_address || "Not specified"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="  font-semibold  text-sm  ">Contact</p>
                    <p className="   text-sm  ">{product.store_contact || "Not specified"}</p>
                  </div>
                </div>
              )}


              {product.description && (<div className="text-sm text-gray-700 leading-relaxed break-words border border-gray-300 rounded-2xl p-4 mt-6">
                <p className="font-bold text-black">Product details</p>

                {product.description || ""}
              </div>
              )}

            </div>

            {/* Sticky Bottom Buttons */}
            <div className="sticky bottom-0 flex w-full bg-white ml-0.5 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 border border-[#ffd912] bg-white text-black font-bold text-sm hover:bg-gray-300 transition mb-2">
                Add to Cart
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 py-3 bg-[#ffd912] text-black font-bold text-sm hover:opacity-90 transition mb-2">
                Buy Now
              </button>


            </div>


          </div>
        </div>)
        :
        (
          (<div>
            <PurchaseNow
              product={product}
              userId={user.id} />
          </div>)
        )
      }

    </div>

  );
}

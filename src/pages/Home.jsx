import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/homeComponents/Header";
import SearchBar from "../components/homeComponents/SearchBar";
import OfferPoster from "../components/homeComponents/OfferPoster";
import ProductList from "../components/homeComponents/ProductList";
import BottomNavigation from "../components/BottomNavigation";
import CategoryBar from "../components/homeComponents/CategoryBar";
import CategoryProductList from "../components/homeComponents/CategoryProductList";
import { API_URL } from "../config/api";

function Home() {
  const [homeData, setHomeData] = useState({ categories: [], offers: [] });
  const [loadingHome, setLoadingHome] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch(`${API_URL}/home-data`);
        const data = await res.json();
        if (res.ok) {
          setHomeData({ categories: data.categories || [], offers: data.offers || [] });
        }
      } catch (err) {
        console.error("Home data fetch error:", err);
      }
      setLoadingHome(false);
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20  ">

      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="sticky top-14 z-50 bg-white px-4 sm:px-6 lg:px-8">
        <SearchBar onFocus={() => navigate("/Search")} />
      </div>

      <div className="mt-1">
        <CategoryBar categories={homeData.categories} loading={loadingHome} />
      </div>

      <div className="mt-2">
        <OfferPoster offers={homeData.offers} loading={loadingHome} />
      </div>

      <div className="mt-7">
        <ProductList />
      </div>

      <div className="h-26 lg:hidden">
        <BottomNavigation />
      </div>

    </div>
  );
}

export default Home;

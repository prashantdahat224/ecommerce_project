import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import searchIcon from "../assets/search.png";
import backIcon from "../assets/icon_download_back.png";
import { Navigate } from "react-router-dom";
import SearchSuggestionPlaceholder from "../components/placeHolder/SearchSuggestionPlaceholder" //search suggestion
import SortDropdown from "../components/SortDropdown";
import { API_URL } from "../config/api";



export default function Search() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [goBack, setGoBack] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 30;
  const [hasMore, setHasMore] = useState(true);

  const [popularKeywords, setPopularKeywords] = useState([]);

  const [loadingSuggestions, setLoadingSuggestions] = useState(false); //addded

  const debounceRef = useRef(null);
  
const [products2, setProducts2] = useState([]);
  const [sortType, setSortType] = useState(null);


  /* -------------------------------
     Autocomplete suggestions (Netlify)
  -------------------------------- */
  const handleInputChange = (value) => {
    setQuery(value);
    setShowResults(false);

    if (!value.trim()) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);

    setLoadingSuggestions(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}/search-suggestions?q=${value}`
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      }finally{
        setLoadingSuggestions(false);
      }
    }, 300);
  };

  /* -------------------------------
     Final search  
  -------------------------------- */
  const handleSearch = async (keyword, pageNumber = 0) => {
    keyword = keyword.toLowerCase();

    setQuery(keyword);
    setShowResults(true);
    setSuggestions([]);
    setPage(pageNumber);

    try {
      const res = await fetch(
        `${API_URL}/search-products?q=${keyword}&page=${pageNumber}&size=${pageSize}`
        
      );
    

      const data = await res.json();
 
      if (pageNumber === 0) {
        setProducts(data);
      } else {
        setProducts((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === pageSize);
    } catch {
      setProducts([]);
      setHasMore(false);
    }
  };

  /* -------------------------------
     Trending keywords (Netlify)
  -------------------------------- */
  const fetchPopularKeywords = async () => {
    if (popularKeywords.length > 0) return;

    try {
      const res = await fetch(`${API_URL}/trending-keywords`);
      const data = await res.json();
      setPopularKeywords(data || []);
    } catch {}
  };

  if (goBack) return <Navigate to="/home" />;

  return (
    <div>
      {/* Search Bar */}
      <div className="p-4 bg-[#E8E4E0]">
        <div className="w-full flex items-center gap-1">
          <div className="w-10 h-10 cursor-pointer rounded-full p-1">
            <img src={backIcon} alt="Back" onClick={() => setGoBack(true)} />
          </div>

          <div className="flex items-center flex-1 border border-gray-300 bg-white rounded-full">
            <img src={searchIcon} alt="Search" className="w-5 h-5 ml-3" />

            <input
              autoFocus
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={fetchPopularKeywords}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              placeholder="Search your wish..."
              className="flex-1 px-3 py-2 bg-transparent focus:outline-none rounded-full  
              placeholder-gray-500 "
            />
          </div>
        </div>
      </div>

      <div className="lg:mx-60">

      {/* Trending */}
      {query === "" && !showResults && popularKeywords.length > 0 && (
        <div className="bg-white">
          {popularKeywords.map((keyword, i) => (
            <div
              key={i}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSearch(keyword)}
            >
              <div className="flex items-center gap-2 border-b border-gray-300">
                <img src={searchIcon} alt="icon" className="w-4 h-4 ml-4" />
                <span>{keyword}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
{/* Suggestions loading placeholder */}
{!showResults && loadingSuggestions && query !== "" && (
  <SearchSuggestionPlaceholder />
)}

{/* Suggestions results */}
{!showResults && !loadingSuggestions && suggestions.length > 0 && (
  <div className="bg-white">
    {suggestions.map((keyword) => (
      <div
        key={keyword}
        className="p-1 cursor-pointer hover:bg-gray-100"
        onClick={() => handleSearch(keyword)}
      >
        <div className="flex items-center gap-2 border-b border-gray-300">
          <img src={searchIcon} alt="Search" className="w-4 h-4 ml-4" />
          <div>{keyword}</div>
        </div>
      </div>
    ))}
  </div>
)}
 {/* Suggestions */}
         
      {showResults &&(<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="text-sm ml-2 mt-2 block w-20 md:w-64 px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 "
> 
  
  
  <option value="" disabled> SORT</option>
  <option value="price_low_high">Price - Low to High</option>
  <option value="price_high_low">Price - High to Low</option>
  <option value="priority_score">Priority Score</option>
  <option value="popularity">Popularity</option>
  <option value="newest">Newest</option>
</select> )}   

      {/* Results */}
      {showResults && (
        <div className="p-2 mt-2">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-3 text-gray-500">No products found.</div>
          )}
        </div>
      )}

      {/* Load more */}
      {showResults && products.length > 0 && hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSearch(query, page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
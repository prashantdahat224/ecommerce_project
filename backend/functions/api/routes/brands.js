// brands.js (AWS Lambda)
const { createClient } = require("@supabase/supabase-js");
 
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://www.wishmos.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
 

  try {
    const { data, error } = await supabase
      .from("brand")
      .select("id,name,brand_image")
      .order("trending_score", { ascending: false })
      .limit(8);

    if (error) {
        console.error("Supabase error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
 
    const withUrls = (data || []).map(cat => {
      if (!cat.brand_image) return cat;

      const { data: urlData } = supabase
        .storage
        .from("category-images")
        .getPublicUrl(cat.brand_image);

      return {
        ...cat,
        brand_image: urlData?.publicUrl || null
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(withUrls)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};

   
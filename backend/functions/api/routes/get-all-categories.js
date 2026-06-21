// get-all-categories.js (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://www.wishmos.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Cache-Control": "public, max-age=60",
  };

  try {
    const mainCategoryId = event.queryStringParameters?.main_category_id;

    let query = supabase
      .from("categories")
      .select("id, name, category_image, main_category_id")
      .order("trending_score", { ascending: false, nullsFirst: false });

    if (mainCategoryId) {
      query = query.eq("main_category_id", mainCategoryId); // ✅ filter by parent
    }

    const { data, error } = await query;

    if (error) throw error;

    const withUrls = (data || []).map(cat => {
      if (!cat.category_image) return cat;

      const { data: urlData } = supabase
        .storage
        .from("category-images")
        .getPublicUrl(cat.category_image);

      return {
        ...cat,
        category_image: urlData?.publicUrl || null
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
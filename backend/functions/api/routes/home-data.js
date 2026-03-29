// /functions/api/routes/home-data.js

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://www.wishmos.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  try {
    // ✅ fetch categories + offers in parallel — single Lambda call
    const [categoriesRes, offersRes] = await Promise.all([
      supabase
        .from("categories")
        .select("id,name,category_image")
        .order("trending_score", { ascending: false })
        .limit(8),

      supabase
        .from("offers")
        .select("*")
        .order("priority_score", { ascending: true }),
    ]);

    if (categoriesRes.error) throw categoriesRes.error;
    if (offersRes.error) throw offersRes.error;

    // attach public URLs for categories
    const categories = (categoriesRes.data || []).map((cat) => {
      if (!cat.category_image) return cat;
      const { data: urlData } = supabase.storage
        .from("category-images")
        .getPublicUrl(cat.category_image);
      return { ...cat, category_image: urlData?.publicUrl || null };
    });

    // attach public URLs for offers
    const offers = (offersRes.data || []).map((offer) => {
      let imageUrl = offer.image_url || "";
      if (imageUrl) {
        const { data: urlData } = supabase.storage
          .from("offers")
          .getPublicUrl(imageUrl);
        imageUrl = urlData.publicUrl;
      }
      return { ...offer, public_url: imageUrl };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ categories, offers }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

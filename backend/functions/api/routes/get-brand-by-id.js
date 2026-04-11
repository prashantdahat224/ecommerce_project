// get-brand-by-id.js (AWS Lambda)
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
  };

  try {
    const id = event.queryStringParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Brand id required" })
      };
    }

    const { data, error } = await supabase
      .from("brand")
      .select("id, name, brand_image")
      .eq("id", id)
      .single();

    if (error) throw error;

    let brandImageUrl = "";

    if (data.brand_image) {
      const { data: urlData } = supabase
        .storage
       .from("category-images") // ← change to your actual bucket name if different
        .getPublicUrl(data.brand_image);

      brandImageUrl = urlData?.publicUrl || "";
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...data, brand_image_url: brandImageUrl })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
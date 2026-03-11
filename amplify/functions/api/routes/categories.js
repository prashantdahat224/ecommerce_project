// categories.js (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  try {

    const { data, error } = await supabase
      .from("categories")
      .select("id,name,category_image")
      .order("trending_score", { ascending: false })
      .limit(8);

    if (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: error.message })
      };
    }

    const withUrls = data.map(cat => {
      if (!cat.category_image) return cat;

      const { data: urlData } = supabase
        .storage
        .from("category-images")
        .getPublicUrl(cat.category_image);

      return {
        ...cat,
        category_image: urlData.publicUrl
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(withUrls)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
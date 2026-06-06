// get all categories
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const { data, error } = await supabase
      .from("brand")
      .select("id, name, brand_image")
      .order("trending_score", { ascending: false });

    if (error) throw error;

    const categoriesWithUrls = (data || []).map((cat) => {
      let publicUrl = "";

      if (cat.brand_image) {
        const { data: urlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(cat.brand_image);

        publicUrl = urlData.publicUrl;
      }

      return {
        ...cat,
        category_image: publicUrl,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(categoriesWithUrls),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify([]),
    };
  }
};
// get product by id (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const query = event.queryStringParameters || {};
    const id = query.id;

    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Product id required" })
      };
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    let featuredUrl = "";
    let productUrl = "";

    if (data.featured_image) {
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(data.featured_image);

      featuredUrl = urlData.publicUrl;
    }

    if (data.product_image) {
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(data.product_image);

      productUrl = urlData.publicUrl;
    }

    const additionalUrls = (data.additional_images || []).map((imgPath) => {
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(imgPath);

      return urlData.publicUrl;
    });

    const finalProduct = {
      ...data,
      featured_image_url: featuredUrl,
      Product_image_url: productUrl,
      additional_images_url: additionalUrls,
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(finalProduct)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
// search-products.js (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const params = event.queryStringParameters || {};
    const keyword = (params.q || "").toLowerCase();
    const page = Number(params.page || 0);
    const size = Number(params.size || 30);

    const from = page * size;
    const to = from + size - 1;

    const { data, error } = await supabase
      .from("product_keywords")
      .select(`
        products (
          id,
          name,
          currency,
          price,
          about,
          product_image,
          priority_score,
          clicks_count
        ),
        keywords!inner (name)
      `)
      .eq("keywords.name", keyword)
      .range(from, to);

    if (error) throw error;

    // const products = (data || [])
    //   .map(item => item.products)
    //   .filter(Boolean)
    //   .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
const products = (data || [])
  .map(item => item.products)
  .filter(Boolean)
  .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
  .map(product => {
    if (!product.product_image) return product;
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(product.product_image);
    return {
      ...product,
      product_image: urlData?.publicUrl || null
    };
  });
  
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };

  }
};
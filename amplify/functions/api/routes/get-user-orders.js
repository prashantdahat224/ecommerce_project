// get user orders (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    let userId =
      event.queryStringParameters?.id ||
      new URLSearchParams(event.rawQueryString).get("id");

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID required" })
      };
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        created_at,
        product_image,
        product_name
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const withUrls = (data || []).map(order => {
      let publicUrl = "";

      if (order.product_image) {
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(order.product_image);

        publicUrl = urlData.publicUrl;
      }

      return {
        ...order,
        product_image_url: publicUrl
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(withUrls)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
// add to cart

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    if (event.httpMethod && event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
    }

    const { user_id, product_id } = JSON.parse(event.body || "{}");

    if (!user_id || !product_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "user_id and product_id required"
        })
      };
    }

    const { data, error } = await supabase
      .from("product_cart")
      .upsert(
        { user_id, product_id },
        {
          onConflict: "user_id,product_id",
          ignoreDuplicates: true
        }
      )
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: data.length > 0 ? "added" : "exists"
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
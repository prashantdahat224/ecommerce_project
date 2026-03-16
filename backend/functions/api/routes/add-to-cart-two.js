const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const body = typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;

    const { userId, productId } = body;

    const { data, error } = await supabase
      .from("product_cart")
      .upsert(
        { user_id: userId, product_id: productId },
        { onConflict: ["user_id", "product_id"], ignoreDuplicates: true }
      )
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };

  }
};
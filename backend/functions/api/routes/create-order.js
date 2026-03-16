// create-order (AWS Lambda version)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const body = JSON.parse(event.body);

    const orderCode = "ORDER-" + Math.floor(Math.random() * 1000000);

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          order_code: orderCode,
          user_id: body.user_id,
          product_id: body.product_id,
          product_name: body.product_name,
          product_image: body.product_image,
          product_code: body.product_code,
          quantity: 1,
          status: "pending",
          created_at: new Date()
        }
      ]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        success: true,
        order_code: orderCode
      })
    };

  } catch (err) {

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: err.message })
    };

  }
};
// products.js (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const params = event.queryStringParameters || {};
    const from = Number(params.from || 0);
    const to = Number(params.to || 29);

    const { data, error } = await supabase
      .from("products")
      .select("id,product_image,name,about,price,currency")
      .order("priority_score", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: error.message })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    };
  }
};
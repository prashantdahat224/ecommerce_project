// category products

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const params = event.queryStringParameters || {};

    const categoryId = params.categoryId;
    const page = Number(params.page || 0);
    const size = Number(params.size || 30);

    if (!categoryId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "categoryId required" })
      };
    }

    const from = page * size;
    const to = from + size - 1;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("brand_id", categoryId)
      .order("priority_score", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data || [])
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
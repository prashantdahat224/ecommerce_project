const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const params = event.queryStringParameters || {};
    const q = params.q || "";

    const { data, error } = await supabase
      .from("keywords")
      .select("name")
      .ilike("name", `${q}%`)
      .limit(12);

    if (error) throw error;

    const uniqueKeywords = [...new Set(data.map(k => k.name))];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(uniqueKeywords),
    };

  } catch (err) {

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify([]),
    };

  }
};
// check admin role

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const params = event.queryStringParameters || {};
    const id = params.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID required" })
      };
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", id)
      .single();

    if (error || !data) {
      return {
        statusCode: 200,
        body: JSON.stringify({ isAdmin: false })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ isAdmin: data.role === "admin" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
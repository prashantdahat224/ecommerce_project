// check admin

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const userId = event.queryStringParameters?.id;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID required" })
      };
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        isAdmin: !!data,
        role: data?.role || null
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
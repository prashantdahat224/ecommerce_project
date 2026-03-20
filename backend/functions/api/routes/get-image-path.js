// routes/get-image-path.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const path = body.path;

    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Path is required" }),
      };
    }

    const { data } = supabase.storage
      .from("products") // same bucket as before
      .getPublicUrl(path);

    return {
      statusCode: 200,
      body: JSON.stringify({ publicUrl: data?.publicUrl || "" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

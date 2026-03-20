// routes/edit-profile.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { userId, name, number } = body;

    if (!userId || !name || !number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "userId, name, and number are required" }),
      };
    }

    const { error } = await supabase
      .from("users")
      .update({ name, number })
      .eq("id", userId);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Profile updated successfully" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

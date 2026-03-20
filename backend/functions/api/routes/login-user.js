const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // keep secret!
);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    // ✅ Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }

    // ✅ Return user + session
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: data.user,
        session: data.session, // contains access_token, refresh_token
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function requireAuth(event) {
  const authHeader = event.headers?.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) return { error: "No token provided", status: 401 };

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return { error: "Unauthorized", status: 401 };

  return { user: data.user }; // ✅ returns verified user
}

module.exports = { requireAuth };
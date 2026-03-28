// // routes/get-profile.js
// routes/get-profile.js

const { createClient } = require("@supabase/supabase-js");
const { requireAuth } = require("../middleware/requireAuth");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {

    const auth = await requireAuth(event);
    if (auth.error) return { statusCode: auth.status, body: JSON.stringify({ error: auth.error }) };

    const { data, error } = await supabase
      .from("profiles")
      .select("name, number")
      .eq("user_id", auth.user.id) // ✅ from verified token, not request body
      .single();

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ name: data?.name || "", number: data?.number || "" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};


// const { createClient } = require("@supabase/supabase-js");

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// exports.handler = async (event) => {
//   try {
//     const body = event.body ? JSON.parse(event.body) : {};
//     const { userId } = body;

//     if (!userId) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "userId is required" }),
//       };
//     }

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("name, number")
//       .eq("user_id", userId)
//       .single();

//     if (error) {
//       return {
//         statusCode: 500,
//         body: JSON.stringify({ error: error.message }),
//       };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ name: data?.name || "", number: data?.number || "" }),
//     };
//   } catch (err) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message }),
//     };
//   }
// };

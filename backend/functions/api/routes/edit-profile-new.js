// // routes/edit-profile.js


// routes/edit-profile.js

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

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, number } = body;

    if (!name || !number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "name and number are required" }),
      };
    }

    const { error } = await supabase
      .from("users")
      .update({ name, number })
      .eq("id", auth.user.id); // ✅ from verified token, not request body

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

// const { createClient } = require("@supabase/supabase-js");

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// exports.handler = async (event) => {
//   try {
//     const body = event.body ? JSON.parse(event.body) : {};
//     const { userId, name, number } = body;

//     if (!userId || !name || !number) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "userId, name, and number are required" }),
//       };
//     }

//     const { error } = await supabase
//       .from("users")
//       .update({ name, number })
//       .eq("id", userId);

//     if (error) {
//       return {
//         statusCode: 500,
//         body: JSON.stringify({ error: error.message }),
//       };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Profile updated successfully" }),
//     };
//   } catch (err) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message }),
//     };
//   }
// };

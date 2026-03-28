// // routes/wishlist.js

// routes/wishlist.js

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
    const { action, productId } = body;

    const userId = auth.user.id; // ✅ from verified token, not request body

    // Fetch wishlist items
    if (action === "fetch") {
      const { data, error } = await supabase
        .from("wish_list_products")
        .select("product_id")
        .eq("user_id", userId);

      if (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ items: data.map((item) => item.product_id) }),
      };
    }

    // Toggle wishlist
    if (action === "toggle" && productId) {
      const { data: existing, error: fetchError } = await supabase
        .from("wish_list_products")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        return { statusCode: 500, body: JSON.stringify({ error: fetchError.message }) };
      }

      if (existing) {
        const { error } = await supabase
          .from("wish_list_products")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);

        if (error) {
          return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ productId, action: "remove" }),
        };
      } else {
        const { error } = await supabase
          .from("wish_list_products")
          .insert([{ user_id: userId, product_id: productId }]);

        if (error) {
          return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ productId, action: "add" }),
        };
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid action or missing parameters" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
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
//     const { userId, action, productId } = body;

//     if (!userId) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: "userId is required" }),
//       };
//     }

//     // Fetch wishlist items
//     if (action === "fetch") {
//       const { data, error } = await supabase
//         .from("wish_list_products")
//         .select("product_id")
//         .eq("user_id", userId);

//       if (error) {
//         return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
//       }

//       return {
//         statusCode: 200,
//         body: JSON.stringify({ items: data.map((item) => item.product_id) }),
//       };
//     }

//     // Toggle wishlist
//     if (action === "toggle" && productId) {
//       const { data: existing, error: fetchError } = await supabase
//         .from("wish_list_products")
//         .select("*")
//         .eq("user_id", userId)
//         .eq("product_id", productId)
//         .single();

//       if (fetchError && fetchError.code !== "PGRST116") {
//         return { statusCode: 500, body: JSON.stringify({ error: fetchError.message }) };
//       }

//       if (existing) {
//         const { error } = await supabase
//           .from("wish_list_products")
//           .delete()
//           .eq("user_id", userId)
//           .eq("product_id", productId);

//         if (error) {
//           return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
//         }

//         return {
//           statusCode: 200,
//           body: JSON.stringify({ productId, action: "remove" }),
//         };
//       } else {
//         const { error } = await supabase
//           .from("wish_list_products")
//           .insert([{ user_id: userId, product_id: productId }]);

//         if (error) {
//           return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
//         }

//         return {
//           statusCode: 200,
//           body: JSON.stringify({ productId, action: "add" }),
//         };
//       }
//     }

//     return {
//       statusCode: 400,
//       body: JSON.stringify({ error: "Invalid action or missing parameters" }),
//     };
//   } catch (err) {
//     return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
//   }
// };

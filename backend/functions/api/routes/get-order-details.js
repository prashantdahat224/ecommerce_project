// // get order details


// get order details

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

    const orderId = event.queryStringParameters?.id;

    if (!orderId) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Order ID required" })
      };
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", auth.user.id) // ✅ ensures user can only fetch their own order
      .single();

    if (error) throw error;

    if (!data) {
      return {
        statusCode: 403,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Order not found or access denied" })
      };
    }

    // convert storage path → public url
    if (data?.product_image) {
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(data.product_image);

      data.public_image_url = urlData.publicUrl;
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
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

//     const orderId = event.queryStringParameters?.id;

//     if (!orderId) {
//       return {
//         statusCode: 400,
//         headers: { "Access-Control-Allow-Origin": "*" },
//         body: JSON.stringify({ error: "Order ID required" })
//       };
//     }

//     const { data, error } = await supabase
//       .from("orders")
//       .select("*")
//       .eq("id", orderId)
//       .single();

//     if (error) throw error;

//     // convert storage path → public url
//     if (data?.product_image) {
//       const { data: urlData } = supabase.storage
//         .from("products")
//         .getPublicUrl(data.product_image);

//       data.public_image_url = urlData.publicUrl;
//     }

//     return {
//       statusCode: 200,
//       headers: { "Access-Control-Allow-Origin": "*" },
//       body: JSON.stringify(data)
//     };

//   } catch (err) {
//     return {
//       statusCode: 500,
//       headers: { "Access-Control-Allow-Origin": "*" },
//       body: JSON.stringify({ error: err.message })
//     };
//   }
// };
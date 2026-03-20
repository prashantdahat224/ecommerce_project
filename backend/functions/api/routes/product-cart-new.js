// routes/product-cart.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch cart items
exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { userId, action, cartId } = body;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "userId is required" }),
      };
    }

    if (action === "fetch") {
      const { data, error } = await supabase
        .from("product_cart")
        .select("id,user_id, product_id, products(name,currency, price, product_image,product_code,about)")
        .eq("user_id", userId);

      if (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }

      // Attach public URLs
      const withUrls = data.map((cat) => {
        let publicUrl = null;
        if (cat.products.product_image) {
          const { data: urlData } = supabase
            .storage
            .from("products")
            .getPublicUrl(cat.products.product_image);
          publicUrl = urlData.publicUrl;
        }
        return {
          ...cat,
          products: {
            ...cat.products,
            product_image_url: publicUrl || "",
          },
        };
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ cartItems: withUrls, count: data.length }),
      };
    }

    if (action === "remove" && cartId) {
      const { error } = await supabase
        .from("product_cart")
        .delete()
        .eq("id", cartId);

      if (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Item removed successfully" }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid action or missing parameters" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

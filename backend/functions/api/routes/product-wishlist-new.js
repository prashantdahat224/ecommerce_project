// routes/product-wishlist.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { userId, action, wishListId } = body;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "userId is required" }),
      };
    }

    // Fetch wishlist items
    if (action === "fetch") {
      const { data, error } = await supabase
        .from("wish_list_products")
        .select("id,user_id, products(id,name,currency, price, product_image,product_code,about)")
        .eq("user_id", userId);

      if (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }

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
        body: JSON.stringify({ wishListItems: withUrls, count: data.length }),
      };
    }

    // Remove item from wishlist
    if (action === "remove" && wishListId) {
      const { error } = await supabase
        .from("wish_list_products")
        .delete()
        .eq("id", wishListId);

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

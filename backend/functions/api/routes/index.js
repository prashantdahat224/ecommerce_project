const { createClient } = require("@supabase/supabase-js");
//require("dotenv").config();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

exports.handler = async (event) => {

  const method =
    event.requestContext?.http?.method || event.httpMethod;

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {

    const productId =
      event.queryStringParameters?.id ||
      event.queryStringParameters?.productId;

    // Health check
    if (!productId) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        body: "<html><body>gift-shop Backend Running</body></html>",
      };
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        body: "<html><body>Service not configured</body></html>",
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: product, error } = await supabase
      .from("products")
      .select("name, about, product_image")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        body: "<html><body>Product not found</body></html>",
      };
    }

    let imageUrl = "";

    if (product.product_image) {
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(product.product_image);

      imageUrl = data?.publicUrl || "";
    }

    const url = `https://gifts-and-craft.com/product/${productId}`;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta property="og:title" content="${product.name}" />
<meta property="og:description" content="${product.about || " from WISHMOS"}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
</head>
<body>
<h1>${product.name}</h1>
<img src="${imageUrl}" />
<p>${product.about || ""}</p>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html" },
      body: html,
    };

  } catch (error) {

    console.error("Function error:", error);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "text/html" },
      body: "<html><body>gift-shop</body></html>",
    };

  }
};
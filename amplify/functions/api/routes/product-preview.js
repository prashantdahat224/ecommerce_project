// product-preview.js (AWS Lambda version)

const { createClient } = require("@supabase/supabase-js");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
};

exports.handler = async (event) => {
  try {

    const productId =
      event.queryStringParameters?.id ||
      new URLSearchParams(event.rawQueryString).get("id");

    if (!productId) {
      return htmlResponse("Product not found");
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // fetch product
    const { data: product, error } = await supabase
      .from("products")
      .select("name, about, product_image")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return htmlResponse("Product not found");
    }

    // get public image url
    let imageUrl = "";
    if (product.product_image) {
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(product.product_image);

      imageUrl = data.publicUrl;
    }

    const pageUrl = `https://gifts-and-craft.com/product/${productId}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(product.name)}</title>

<meta property="og:title" content="${escapeHtml(product.name)}">
<meta property="og:description" content="${escapeHtml(product.about || "Gift from Gift Shop")}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:url" content="${pageUrl}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Gift Shop">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(product.name)}">
<meta name="twitter:description" content="${escapeHtml(product.about || "")}">
<meta name="twitter:image" content="${imageUrl}">

<style>
body { margin:0; font-family:sans-serif; }
.hidden { display:none; }
</style>

</head>
<body>

<div class="hidden">
<h1>${escapeHtml(product.name)}</h1>
<img src="${imageUrl}" />
<p>${escapeHtml(product.about || "")}</p>
</div>

</body>
</html>
`;

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache",
      },
      body: html,
    };

  } catch (err) {
    return htmlResponse("Server error");
  }
};


// helper function
function htmlResponse(text) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache",
    },
    body: `<html><body>${text}</body></html>`,
  };
}


// prevent HTML breaking
function escapeHtml(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
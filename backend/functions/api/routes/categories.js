// categories.js (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

// console.log("Supabase URL:", process.env.SUPABASE_URL); // ✅ log here
// console.log("Supabase Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Key is set" : "Key is missing");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://www.wishmos.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Cache-Control": "public, max-age=60"  // ✅ add here//new added cache control header

  };

//   console.log("ENV URL:", process.env.SUPABASE_URL);
// console.log("EVENT:", event);

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,category_image")
      .order("trending_score", { ascending: false })
      .limit(8);

    if (error) {
        console.error("Supabase error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
 
    const withUrls = (data || []).map(cat => {
      if (!cat.category_image) return cat;

      const { data: urlData } = supabase
        .storage
        .from("category-images")
        .getPublicUrl(cat.category_image);

      return {
        ...cat,
        category_image: urlData?.publicUrl || null
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(withUrls)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};

 
//   try {

//     const { data, error } = await supabase
//       .from("categories")
//       .select("id,name,category_image")
//       .order("trending_score", { ascending: false })
//       .limit(8);

//     if (error) {
//       return {
//         statusCode: 500,
//         headers: {
//           "Access-Control-Allow-Origin": "*"
//         },
//         body: JSON.stringify({ error: error.message })
//       };
//     }

//     const withUrls = data.map(cat => {
//       if (!cat.category_image) return cat;

//       const { data: urlData } = supabase
//         .storage
//         .from("category-images")
//         .getPublicUrl(cat.category_image);

//       return {
//         ...cat,
//         category_image: urlData.publicUrl
//       };
//     });

//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*"
//       },
//       body: JSON.stringify(withUrls)
//     };

//   } catch (err) {
//     return {
//       statusCode: 500,
//       headers: {
//         "Access-Control-Allow-Origin": "*"
//       },
//       body: JSON.stringify({ error: err.message })
//     };
//   }
// };
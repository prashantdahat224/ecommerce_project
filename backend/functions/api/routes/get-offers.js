// get offers (AWS Lambda)

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      //.in("id", ["offer1", "offer2", "offer3", "offer4"])
      .order("priority_score", { ascending: true });

    if (error) throw error;

    const offersWithUrls = (data || []).map((offer) => {
      let imageUrl = offer.image_url || "";

      if (imageUrl) {
        const { data: urlData } = supabase.storage
          .from("offers")
          .getPublicUrl(imageUrl);

        imageUrl = urlData.publicUrl;
      }

      return { ...offer, public_url: imageUrl };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offersWithUrls),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
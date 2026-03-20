import { API_URL } from "../config/api";

export const getPublicImage = async (path) => {
  if (!path) return "";

  try {
    const response = await fetch(`${API_URL}/get-image-path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    const result = await response.json();
    return result.publicUrl || "";
  } catch (error) {
    console.error("Error fetching image path:", error);
    return "";
  }
};


// import { supabase } from "../supabaseClient";

// export const getPublicImage = (path) => {
//   if (!path) return "";

//   const { data } = supabase.storage
//     .from("products") //  use SAME bucket as old code
//     .getPublicUrl(path);

//   return data?.publicUrl || "";
// };

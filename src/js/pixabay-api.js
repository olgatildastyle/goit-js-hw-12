import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "53429701-1a3d0b5c13468a36cfdf6d483";

export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    page,
    per_page: 15,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
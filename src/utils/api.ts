import axios from "axios";

const BASE_URL = "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues";

export const fetchVenueStatic = async (venueSlug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${venueSlug}/static`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue static data:", error);
    throw new Error("Failed to fetch venue static data.");
  }
};

export const fetchVenueDynamic = async (venueSlug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${venueSlug}/dynamic`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue dynamic data:", error);
    throw new Error("Failed to fetch venue dynamic data.");
  }
};

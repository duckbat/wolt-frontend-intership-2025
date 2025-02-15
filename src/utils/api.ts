import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Fetches the static data for a venue
export const fetchVenueStatic = async (venueSlug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${venueSlug}/static`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue static data:", error);
    throw new Error("Failed to fetch venue static data");
  }
};

// Fetch dynamic data for a venue
export const fetchVenueDynamic = async (venueSlug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${venueSlug}/dynamic`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue dynamic data:", error);
    throw new Error("Failed to fetch venue dynamic data");
  }
};
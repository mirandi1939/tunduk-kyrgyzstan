import api from "./api";

export const fetchItinerariesRequest = async (filters = {}) => {
    const res = await api.get("/api/itineraries", { params: filters });
    return res.data;
};

export const fetchItineraryRequest = async (id) => {
    const res = await api.get(`/api/itineraries/${id}`);
    return res.data;
};

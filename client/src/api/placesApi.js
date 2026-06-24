import api from "./api";

export const fetchPlacesRequest = async () => {
    const res = await api.get("/api/places");
    return res.data;
};

export const fetchAlternativesRequest = async (
    googlePlaceId,
    limit = 3
) => {
    const res = await api.get(
        `/api/places/${googlePlaceId}/alternatives`,
        {
            params: { limit },
        }
    );
    return res.data;
};

import api from "./api";

export const fetchFoodRequest = async (filters = {}) => {
    const res = await api.get("/api/food", { params: filters });
    return res.data;
};

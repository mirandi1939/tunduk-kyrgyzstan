import api from "./api";

export const fetchWomensInfoRequest = async (filters = {}) => {
    const res = await api.get("/api/womens", { params: filters });
    return res.data;
};

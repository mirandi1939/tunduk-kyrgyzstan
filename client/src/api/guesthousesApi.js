import api from "./api";

export const fetchGuesthousesRequest = async (filters = {}) => {
    const res = await api.get("/api/guesthouses", { params: filters });
    return res.data;
};

export const fetchGuesthouseRequest = async (id) => {
    const res = await api.get(`/api/guesthouses/${id}`);
    return res.data;
};

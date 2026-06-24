import api from "./api";

export const fetchEmergencyRequest = async (filters = {}) => {
    const res = await api.get("/api/emergency", { params: filters });
    return res.data;
};

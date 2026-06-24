import api from "./api";

export const fetchOperatorsRequest = async (filters = {}) => {
    const res = await api.get("/api/operators", { params: filters });
    return res.data;
};

export const fetchOperatorRequest = async (id) => {
    const res = await api.get(`/api/operators/${id}`);
    return res.data;
};

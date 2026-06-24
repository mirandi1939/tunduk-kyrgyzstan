import api from "./api";

export const fetchPostsRequest = async (filters = {}) => {
    const res = await api.get("/api/forum", { params: filters });
    return res.data;
};

export const submitPostRequest = async (post) => {
    const res = await api.post("/api/forum", post);
    return res.data;
};

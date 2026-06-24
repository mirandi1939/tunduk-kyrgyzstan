import api from "./api";

export const setAdminAuth = (login, password) => {
    const token = btoa(`${login}:${password}`);
    sessionStorage.setItem("adminAuth", token);
};

export const clearAdminAuth = () => {
    sessionStorage.removeItem("adminAuth");
};

const withAuth = () => {
    const token = sessionStorage.getItem("adminAuth");
    return token
        ? { Authorization: `Basic ${token}` }
        : {};
};

export const fetchAllPlacesAdminRequest = async () => {
    const res = await api.get("/api/admin/places", {
        headers: withAuth(),
    });
    return res.data;
};

export const updateGoogleDataRequest = async () => {
    const res = await api.get(
        "/api/admin/places/google/update/all",
        {
            headers: withAuth(),
        }
    );
    return res.data;
};

export const fetchPlaceAdminRequest = async (googlePlaceId) => {
    const res = await api.get(
        `/api/admin/places/${googlePlaceId}`,
        {
            headers: withAuth(),
        }
    );
    return res.data;
};

export const updatePlaceAdminRequest = async (
    googlePlaceId,
    payload
) => {
    const res = await api.put(
        `/api/admin/places/${googlePlaceId}`,
        payload,
        {
            headers: withAuth(),
        }
    );
    return res.data;
};

export const addPlaceAdminRequest = async (payload) => {
    const res = await api.post(
        "/api/admin/places",
        payload,
        {
            headers: withAuth(),
        }
    );
    return res.data;
};

export const deletePlaceAdminRequest = async (googlePlaceId) => {
    const res = await api.delete(
        `/api/admin/places/${googlePlaceId}`,
        {
            headers: withAuth(),
        }
    );
    return res.data;
};

export const uploadImageRequest = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/api/admin/upload", formData, {
        headers: {
            ...withAuth(),
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

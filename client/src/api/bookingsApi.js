import api from "./api";

export const createBookingRequest = async (booking) => {
    const res = await api.post("/api/bookings", booking);
    return res.data;
};

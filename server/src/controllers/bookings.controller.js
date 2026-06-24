import BookingsService from "../services/bookings.service.js";

class BookingsController {
    async create(req, res) {
        try {
            const { guesthouse_id, guesthouse_name, guest_name, guest_email,
                    guest_phone, check_in, check_out, guests_count, total_price } = req.body;

            if (!guest_name || !guest_email || !check_in || !check_out) {
                return res.status(400).json({ message: "guest_name, guest_email, check_in and check_out are required" });
            }

            const result = await BookingsService.create({
                guesthouse_id, guesthouse_name, guest_name, guest_email,
                guest_phone, check_in, check_out, guests_count, total_price
            });

            res.status(201).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error creating booking" });
        }
    }
}

export default new BookingsController();

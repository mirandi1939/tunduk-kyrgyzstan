import db from "../db/db.js";

class BookingsService {
    create(booking) {
        return new Promise((resolve, reject) => {
            const ref = "KG-" + Date.now().toString(36).toUpperCase();
            db.run(
                `INSERT INTO bookings
                 (guesthouse_id, guesthouse_name, guest_name, guest_email, guest_phone,
                  check_in, check_out, guests_count, total_price, booking_ref)
                 VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [booking.guesthouse_id, booking.guesthouse_name, booking.guest_name,
                 booking.guest_email, booking.guest_phone, booking.check_in,
                 booking.check_out, booking.guests_count, booking.total_price, ref],
                function(err) { err ? reject(err) : resolve({ id: this.lastID, booking_ref: ref }); }
            );
        });
    }
}

export default new BookingsService();

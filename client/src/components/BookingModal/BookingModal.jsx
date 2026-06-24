import { useState } from "react";
import { createBookingRequest } from "../../api/bookingsApi";
import styles from "./BookingModal.module.css";

const STEPS = ["Dates", "Your details", "Payment", "Confirmed"];

const formatCard = val =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = val =>
    val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

const nightsBetween = (a, b) => {
    if (!a || !b) return 0;
    const diff = (new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
};

export default function BookingModal({ guesthouse, onClose }) {
    const [step, setStep] = useState(0);
    const [dates, setDates] = useState({ check_in: "", check_out: "", guests: 1 });
    const [contact, setContact] = useState({ name: "", email: "", phone: "" });
    const [card, setCard] = useState({ number: "", expiry: "", cvv: "", holder: "" });
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const nights = nightsBetween(dates.check_in, dates.check_out);
    const total = nights * guesthouse.price_per_night * dates.guests;

    const today = new Date().toISOString().split("T")[0];

    const handleDateNext = () => {
        if (!dates.check_in || !dates.check_out || nights < 1) {
            setError("Please select valid check-in and check-out dates.");
            return;
        }
        setError("");
        setStep(1);
    };

    const handleContactNext = () => {
        if (!contact.name || !contact.email) {
            setError("Name and email are required.");
            return;
        }
        setError("");
        setStep(2);
    };

    const handlePay = async () => {
        if (!card.number || !card.expiry || !card.cvv || !card.holder) {
            setError("Please fill in all card details.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const result = await createBookingRequest({
                guesthouse_id: guesthouse.id,
                guesthouse_name: guesthouse.name,
                guest_name: contact.name,
                guest_email: contact.email,
                guest_phone: contact.phone,
                check_in: dates.check_in,
                check_out: dates.check_out,
                guests_count: dates.guests,
                total_price: total,
            });
            setBooking(result);
            setStep(3);
        } catch {
            setError("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <p className={styles.headerSub}>Booking</p>
                        <h2 className={styles.headerTitle}>{guesthouse.name}</h2>
                    </div>
                    <button className={styles.close} onClick={onClose}>✕</button>
                </div>

                {/* Step indicator */}
                {step < 3 && (
                    <div className={styles.steps}>
                        {STEPS.slice(0, 3).map((s, i) => (
                            <div key={s} className={`${styles.stepItem} ${i === step ? styles.stepActive : ""} ${i < step ? styles.stepDone : ""}`}>
                                <span className={styles.stepNum}>{i < step ? "✓" : i + 1}</span>
                                <span className={styles.stepLabel}>{s}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.body}>

                    {/* ── Step 0: Dates ── */}
                    {step === 0 && (
                        <div className={styles.form}>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Check-in</label>
                                    <input type="date" min={today} value={dates.check_in}
                                        onChange={e => setDates(d => ({ ...d, check_in: e.target.value }))} />
                                </div>
                                <div className={styles.field}>
                                    <label>Check-out</label>
                                    <input type="date" min={dates.check_in || today} value={dates.check_out}
                                        onChange={e => setDates(d => ({ ...d, check_out: e.target.value }))} />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Guests</label>
                                <select value={dates.guests} onChange={e => setDates(d => ({ ...d, guests: +e.target.value }))}>
                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
                                </select>
                            </div>
                            {nights > 0 && (
                                <div className={styles.priceBox}>
                                    <div className={styles.priceRow}>
                                        <span>${guesthouse.price_per_night} × {nights} night{nights > 1 ? "s" : ""} × {dates.guests} guest{dates.guests > 1 ? "s" : ""}</span>
                                        <strong>${total}</strong>
                                    </div>
                                </div>
                            )}
                            {error && <p className={styles.error}>{error}</p>}
                            <button className={styles.btn} onClick={handleDateNext}>Continue →</button>
                        </div>
                    )}

                    {/* ── Step 1: Contact ── */}
                    {step === 1 && (
                        <div className={styles.form}>
                            <div className={styles.field}>
                                <label>Full name *</label>
                                <input placeholder="e.g. Sarah Miller" value={contact.name}
                                    onChange={e => setContact(c => ({ ...c, name: e.target.value }))} />
                            </div>
                            <div className={styles.field}>
                                <label>Email address *</label>
                                <input type="email" placeholder="sarah@example.com" value={contact.email}
                                    onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                            </div>
                            <div className={styles.field}>
                                <label>Phone number</label>
                                <input placeholder="+41 79 000 0000" value={contact.phone}
                                    onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <div className={styles.btnRow}>
                                <button className={styles.btnBack} onClick={() => { setError(""); setStep(0); }}>← Back</button>
                                <button className={styles.btn} onClick={handleContactNext}>Continue →</button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Payment ── */}
                    {step === 2 && (
                        <div className={styles.form}>
                            <div className={styles.summary}>
                                <span>{guesthouse.name}</span>
                                <span>{dates.check_in} → {dates.check_out} · {dates.guests} guest{dates.guests > 1 ? "s" : ""}</span>
                                <strong className={styles.summaryTotal}>Total: ${total}</strong>
                            </div>
                            <div className={styles.cardVisual}>
                                <div className={styles.cardChip}>💳</div>
                                <div className={styles.cardNum}>{card.number || "•••• •••• •••• ••••"}</div>
                                <div className={styles.cardBottom}>
                                    <span>{card.holder || "CARDHOLDER NAME"}</span>
                                    <span>{card.expiry || "MM/YY"}</span>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Cardholder name</label>
                                <input placeholder="As shown on card" value={card.holder}
                                    onChange={e => setCard(c => ({ ...c, holder: e.target.value.toUpperCase() }))} />
                            </div>
                            <div className={styles.field}>
                                <label>Card number</label>
                                <input placeholder="1234 5678 9012 3456" value={card.number}
                                    onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))} />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Expiry</label>
                                    <input placeholder="MM/YY" value={card.expiry}
                                        onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))} />
                                </div>
                                <div className={styles.field}>
                                    <label>CVV</label>
                                    <input placeholder="•••" maxLength={4} value={card.cvv}
                                        onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
                                </div>
                            </div>
                            <p className={styles.demoNote}>🔒 Demo mode — no real payment is processed</p>
                            {error && <p className={styles.error}>{error}</p>}
                            <div className={styles.btnRow}>
                                <button className={styles.btnBack} onClick={() => { setError(""); setStep(1); }}>← Back</button>
                                <button className={styles.btn} onClick={handlePay} disabled={loading}>
                                    {loading ? "Processing…" : `Pay $${total}`}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Confirmation ── */}
                    {step === 3 && booking && (
                        <div className={styles.confirmation}>
                            <div className={styles.confIcon}>✓</div>
                            <h3 className={styles.confTitle}>Booking confirmed!</h3>
                            <p className={styles.confRef}>Booking reference: <strong>{booking.booking_ref}</strong></p>
                            <div className={styles.confDetails}>
                                <div className={styles.confRow}><span>Property</span><strong>{guesthouse.name}</strong></div>
                                <div className={styles.confRow}><span>Guest</span><strong>{contact.name}</strong></div>
                                <div className={styles.confRow}><span>Email</span><strong>{contact.email}</strong></div>
                                <div className={styles.confRow}><span>Check-in</span><strong>{dates.check_in}</strong></div>
                                <div className={styles.confRow}><span>Check-out</span><strong>{dates.check_out}</strong></div>
                                <div className={styles.confRow}><span>Guests</span><strong>{dates.guests}</strong></div>
                                <div className={styles.confRow}><span>Total paid</span><strong>${total}</strong></div>
                            </div>
                            <p className={styles.confNote}>A confirmation has been sent to {contact.email}. The guesthouse will contact you with arrival details.</p>
                            <button className={styles.btn} onClick={onClose}>Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

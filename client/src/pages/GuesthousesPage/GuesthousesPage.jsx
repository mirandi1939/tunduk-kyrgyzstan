import { useEffect, useState } from "react";
import { fetchGuesthousesRequest } from "../../api/guesthousesApi";
import BookingModal from "../../components/BookingModal/BookingModal";
import styles from "./GuesthousesPage.module.css";

const REGIONS = ["All", "Chui", "Issyk-Kul", "Naryn", "Osh", "Jalal-Abad"];

const GuesthousesPage = () => {
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState({ women_friendly: "", region: "", has_wifi: "" });
    const [error, setError] = useState("");
    const [bookingTarget, setBookingTarget] = useState(null);

    useEffect(() => {
        const params = {};
        if (filters.women_friendly) params.women_friendly = "1";
        if (filters.region && filters.region !== "All") params.region = filters.region;
        if (filters.has_wifi) params.has_wifi = "1";
        fetchGuesthousesRequest(params)
            .then(setItems)
            .catch(() => setError("Failed to load guesthouses."));
    }, [filters]);

    const toggle = key => setFilters(f => ({ ...f, [key]: f[key] ? "" : "1" }));

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Verified Guesthouses</h1>
                <p className={styles.sub}>All guesthouses are personally verified. Filter by your needs below.</p>
            </div>

            <div className={styles.filters}>
                <button className={`${styles.filterBtn} ${filters.women_friendly ? styles.filterActive : ""}`}
                    onClick={() => toggle("women_friendly")}>🌸 Women-friendly</button>
                <button className={`${styles.filterBtn} ${filters.has_wifi ? styles.filterActive : ""}`}
                    onClick={() => toggle("has_wifi")}>📶 WiFi</button>
                <select className={styles.select} value={filters.region}
                    onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}>
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            <p className={styles.count}>{items.length} guesthouses found</p>

            <div className={styles.grid}>
                {items.map(gh => {
                    const langs = JSON.parse(gh.languages || "[]");
                    return (
                        <div key={gh.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h2 className={styles.name}>{gh.name}</h2>
                                    <p className={styles.location}>{gh.city}, {gh.region}</p>
                                </div>
                                <div className={styles.price}>${gh.price_per_night}<span>/night</span></div>
                            </div>
                            <div className={styles.rating}>{gh.rating} <span>({gh.reviews_count} reviews)</span></div>
                            <p className={styles.desc}>{gh.description}</p>
                            <div className={styles.amenities}>
                                {gh.is_women_friendly ? <span className={`${styles.badge} ${styles.womenBadge}`}>Women-friendly</span> : null}
                                {gh.has_wifi ? <span className={styles.badge}>WiFi</span> : <span className={`${styles.badge} ${styles.badgeNo}`}>No WiFi</span>}
                                {gh.has_hot_water ? <span className={styles.badge}>Hot water</span> : <span className={`${styles.badge} ${styles.badgeNo}`}>No hot water</span>}
                                {gh.is_verified ? <span className={`${styles.badge} ${styles.verifiedBadge}`}>Verified</span> : null}
                            </div>
                            <div className={styles.footer}>
                                <div className={styles.langs}>
                                    {langs.map(l => <span key={l} className={styles.lang}>{l}</span>)}
                                </div>
                                <div className={styles.contact}>
                                    <a href={`tel:${gh.contact_phone}`} className={styles.contactBtn}>Call</a>
                                    <a href={`mailto:${gh.contact_email}`} className={styles.contactBtn}>Email</a>
                                    <button className={styles.bookBtn} onClick={() => setBookingTarget(gh)}>
                                        Book now
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {bookingTarget && (
                <BookingModal
                    guesthouse={bookingTarget}
                    onClose={() => setBookingTarget(null)}
                />
            )}
        </div>
    );
};

export default GuesthousesPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchItinerariesRequest } from "../../api/itinerariesApi";
import styles from "./ItinerariesPage.module.css";

const DIFFICULTY_COLOR = { "Moderate": "#2D6A4F", "Moderate–Challenging": "#D97706", "Challenging": "#B91C1C" };

const ItinerariesPage = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchItinerariesRequest()
            .then(setItems)
            .catch(() => setError("Failed to load itineraries. Please try again."));
    }, []);

    if (error) return <div className={styles.state}>{error}</div>;

    return (
        <div className={styles.page}>
            <div className={styles.pageHead}>
                <p className={styles.overline}>Plan your journey</p>
                <h1 className={styles.pageTitle}>Itineraries</h1>
                <p className={styles.pageSub}>
                    Choose your journey length and explore complete day-by-day plans with verified
                    accommodation, elevation data, and local logistics.
                </p>
            </div>

            <div className={styles.list}>
                {items.map((it, idx) => {
                    const highlights = JSON.parse(it.highlights || "[]");
                    const isEven = idx % 2 === 0;
                    return (
                        <div key={it.id} className={`${styles.card} ${isEven ? styles.cardEven : styles.cardOdd}`}>
                            <div className={styles.cardLeft}>
                                <span className={styles.bigNum}>{it.duration_days}</span>
                                <span className={styles.bigNumLabel}>days</span>
                                {it.is_women_friendly ? <span className={styles.womenPill}>Women-friendly</span> : null}
                            </div>
                            <div className={styles.cardRight}>
                                <div className={styles.cardMeta}>
                                    <span className={styles.difficulty} style={{ color: DIFFICULTY_COLOR[it.difficulty] }}>
                                        ● {it.difficulty}
                                    </span>
                                    <span className={styles.season}>📅 {it.best_season}</span>
                                    <span className={styles.price}>from ${it.price_from}</span>
                                </div>
                                <h2 className={styles.cardTitle}>{it.title}</h2>
                                <p className={styles.cardDesc}>{it.description}</p>
                                <div className={styles.highlights}>
                                    {highlights.map(h => (
                                        <span key={h} className={styles.highlight}>✓ {h}</span>
                                    ))}
                                </div>
                                <Link to={`/itineraries/${it.id}`} className={styles.btn}>
                                    View day-by-day plan →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ItinerariesPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchItineraryRequest } from "../../api/itinerariesApi";
import styles from "./ItineraryDetailPage.module.css";

const ItineraryDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [itinerary, setItinerary] = useState(null);
    const [openDay, setOpenDay] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchItineraryRequest(id)
            .then(setItinerary)
            .catch(() => setError("Failed to load itinerary."));
    }, [id]);

    if (error) return <div className={styles.state}>{error}</div>;
    if (!itinerary) return <div className={styles.state}>Loading…</div>;

    const highlights = JSON.parse(itinerary.highlights || "[]");

    return (
        <div className={styles.page}>
            <button className={styles.back} onClick={() => navigate(-1)}>← Back to Itineraries</button>

            <div className={styles.hero}>
                <span className={styles.daysBadge}>{itinerary.duration_days} days</span>
                <h1 className={styles.title}>{itinerary.title}</h1>
                <div className={styles.meta}>
                    <span>🧗 {itinerary.difficulty}</span>
                    <span>📅 {itinerary.best_season}</span>
                    <span>💰 From ${itinerary.price_from}</span>
                    {itinerary.is_women_friendly ? <span>Women-friendly</span> : null}
                </div>
                <p className={styles.desc}>{itinerary.description}</p>
                <div className={styles.highlights}>
                    {highlights.map(h => <span key={h} className={styles.highlight}>{h}</span>)}
                </div>
            </div>

            <div className={styles.body}>
                <h2 className={styles.sectionTitle}>Day-by-day plan</h2>
                <div className={styles.days}>
                    {(itinerary.days || []).map(day => (
                        <div key={day.day_number} className={`${styles.dayCard} ${openDay === day.day_number ? styles.dayOpen : ""}`}>
                            <button className={styles.dayHeader} onClick={() => setOpenDay(openDay === day.day_number ? null : day.day_number)}>
                                <div className={styles.dayNum}>Day {day.day_number}</div>
                                <div className={styles.dayMeta}>
                                    <strong>{day.title}</strong>
                                    <span>{day.location}</span>
                                </div>
                                <div className={styles.dayStat}>
                                    {day.elevation_m > 0 && <span>⛰ {day.elevation_m}m</span>}
                                    {day.distance_km > 0 && <span>🚶 {day.distance_km}km</span>}
                                </div>
                                <span className={styles.chevron}>{openDay === day.day_number ? "▲" : "▼"}</span>
                            </button>
                            {openDay === day.day_number && (
                                <div className={styles.dayBody}>
                                    <p>{day.description}</p>
                                    {day.accommodation && (
                                        <div className={styles.accommodation}>
                                            <strong>Accommodation:</strong> {day.accommodation}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.cta}>
                    <h3>Ready to book this itinerary?</h3>
                    <p>Contact one of our verified local operators to customise and book this itinerary.</p>
                    <button className={styles.ctaBtn} onClick={() => navigate("/operators")}>Browse Operators →</button>
                </div>
            </div>
        </div>
    );
};

export default ItineraryDetailPage;

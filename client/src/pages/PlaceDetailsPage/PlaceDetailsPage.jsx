import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlaceDetailsPage.module.css";
import api from "../../api/api";

const CROWDED_REVIEWS_THRESHOLD = 2500;
const TYPE_EMOJI_MAP = {
    mountain: "⛰️",
    lake: "💧️",
    waterfall: "🌊",
    valley: "🌳",
    park: "🏞️"
};


const PlaceDetailsPage = () => {
    const { googlePlaceId } = useParams();
    const navigate = useNavigate();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const { data } = await api.get(
                    `/api/places/${googlePlaceId}`
                );
                setPlace(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [googlePlaceId]);

    if (loading) return <div className={styles.loader}>Loading...</div>;
    if (!place) return <div className={styles.error}>Place not found</div>;

    const isCrowded = place.reviews_count >= CROWDED_REVIEWS_THRESHOLD;

    const imageUrl = place.image_path
        ? `${process.env.REACT_APP_API_URL || "http://localhost:5001"}${place.image_path}`
        : null;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                {imageUrl && (
                    <div className={styles.imageWrapper}>
                        <img src={imageUrl} alt={place.name} />
                    </div>
                )}

                {/* CONTENT */}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1>{place.name}</h1>
                        <div className={styles.rating}>⭐ {place.rating}</div>
                    </div>

                    <div className={styles.meta}>
                        <span className={styles.type}>
                            {TYPE_EMOJI_MAP[place.type] ?? "📍"} {place.type}
                        </span>
                        <span className={styles.region}>Near {place.region}</span>
                    </div>
                    <p className={styles.description}>{place.description}</p>

                    {isCrowded && (
                        <div className={styles.crowdedWarning}>
                            <h3>⚠️ Often crowded</h3>
                            <p>
                                This place is very popular this season and is often crowded due
                                to a high number of visitors.
                            </p>
                            <button
                                className={styles.altButton}
                                onClick={() =>
                                    navigate(`/places/${googlePlaceId}/alternatives`)
                                }
                            >
                                View less crowded alternatives
                            </button>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default PlaceDetailsPage;

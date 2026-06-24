import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAlternativesRequest } from "../../api/placesApi";
import AlternativeCard from "../../components/AlternativeCard/AlternativeCard";
import styles from "./PlaceAlternativesPage.module.css";

const PlaceAlternativesPage = () => {
    const { googlePlaceId } = useParams();
    const navigate = useNavigate();

    const [alternatives, setAlternatives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlternatives = async () => {
            try {
                const data = await fetchAlternativesRequest(googlePlaceId, 3);
                setAlternatives(data.alternatives);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAlternatives();
    }, [googlePlaceId]);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className={styles.header}>
                    <h1>Less crowded alternatives</h1>
                    <p>Similar less crowded places nearby</p>
                </div>

                {loading && <div className={styles.state}>Loading...</div>}

                {!loading && alternatives.length === 0 && (
                    <div className={styles.state}>
                        No suitable alternatives found.
                    </div>
                )}

                {!loading && alternatives.length > 0 && (
                    <div className={styles.grid}>
                        {alternatives.slice(0, 3).map(p => (
                            <AlternativeCard key={p.google_place_id} place={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceAlternativesPage;

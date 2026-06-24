import { useEffect, useState } from "react";
import FiltersBar from "../../components/FiltersBar/FiltersBar";
import PlacesGrid from "../../components/PlacesGrid/PlacesGrid";
import styles from "./PlacesPage.module.css";
import { fetchPlacesRequest } from "../../api/placesApi";

const INITIAL_VISIBLE = 12;
const LOAD_MORE_STEP = 6;

const PlacesPage = () => {
    const [places, setPlaces] = useState([]);
    const [filters, setFilters] = useState({
        type: "all",
        rating: "all"
    });
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const data = await fetchPlacesRequest();
                setPlaces(data);
            } catch {
                setError("Failed to load places. Please try again later.");
            }
        };

        fetchPlaces();
    }, []);

    useEffect(() => {
        setVisibleCount(INITIAL_VISIBLE);
    }, [filters]);

    const filteredPlaces = places.filter(place => {
        if (filters.type !== "all" && place.type !== filters.type) {
            return false;
        }
        if (filters.rating !== "all" && place.rating < Number(filters.rating)) {
            return false;
        }
        return true;
    });

    const visiblePlaces = filteredPlaces.slice(0, visibleCount);

    const canShowMore = visibleCount < filteredPlaces.length;

    if (error) return <div className={styles.page}><p>{error}</p></div>;

    return (
        <div className={styles.page}>
            <FiltersBar filters={filters} setFilters={setFilters} />

            <PlacesGrid places={visiblePlaces} />

            {canShowMore && (
                <div className={styles.showMoreWrapper}>
                    <button
                        className={styles.showMoreBtn}
                        onClick={() =>
                            setVisibleCount(prev => prev + LOAD_MORE_STEP)
                        }
                    >
                        Show more
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlacesPage;

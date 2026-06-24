import { Link } from "react-router-dom";
import styles from "./PlaceCard.module.css";

const PlaceCard = ({ place }) => {
    const imageUrl = place.image_path
        ? `${process.env.REACT_APP_API_URL || "http://localhost:5001"}${place.image_path}`
        : "/placeholder.jpg";

    return (
        <Link
            to={`/places/${place.google_place_id}`}
            className={styles.card}
        >
            <div
                className={styles.image}
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            <div className={styles.content}>
                <h3>{place.name}</h3>

                <div className={styles.meta}>
                    <span>{place.type}</span>
                    <span>⭐ {place.rating}</span>
                </div>

                <p className={styles.location}>{place.location}</p>
            </div>
        </Link>
    );
};

export default PlaceCard;

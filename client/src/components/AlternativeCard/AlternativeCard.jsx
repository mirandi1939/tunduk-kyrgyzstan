import { Link } from "react-router-dom";
import styles from "./AlternativeCard.module.css";

const TYPE_EMOJI_MAP = {
    mountain: "⛰️",
    lake: "🏞️",
    waterfall: "💧",
    valley: "🌄",
    park: "🌳"
};

const AlternativeCard = ({ place }) => {
    const imageUrl = place.image_path
        ? `${process.env.REACT_APP_API_URL || "http://localhost:5001"}${place.image_path}`
        : "/images/placeholder.png";

    const distanceLabel =
        typeof place.distance_km === "number"
            ? `${place.distance_km.toFixed(1)} km`
            : "—";

    return (
        <Link to={`/places/${place.google_place_id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={imageUrl} alt={place.name} />
            </div>

            <div className={styles.body}>
                <h3 className={styles.title}>{place.name}</h3>

                <div className={styles.row}>
          <span className={styles.badge}>
            {TYPE_EMOJI_MAP[place.type] ?? "📍"} {place.type}
          </span>

                    <span className={styles.badge}>
            ⭐ {place.rating ?? "—"}
          </span>
                </div>

                <div className={styles.distance}>
                    Distance: <strong>{distanceLabel}</strong>
                </div>
            </div>
        </Link>
    );
};

export default AlternativeCard;

import PlaceCard from "../PlaceCard/PlaceCard";
import styles from "./PlacesGrid.module.css";

const PlacesGrid = ({ places }) => {
    return (
        <div className={styles.grid}>
            {places.map(place => (
                <PlaceCard key={place.id} place={place} />
            ))}
        </div>
    );
};

export default PlacesGrid;

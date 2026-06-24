import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    deletePlaceAdminRequest,
    fetchAllPlacesAdminRequest,
    updateGoogleDataRequest
} from "../../../api/adminApi";
import styles from "./AdminPlacesPage.module.css";

const AdminPlacesListPage = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadPlaces = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchAllPlacesAdminRequest();
            setPlaces(data);
        } catch {
            setError("Failed to load places.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlaces();
    }, []);

    const handleGoogleUpdate = async () => {
        await updateGoogleDataRequest();
        await loadPlaces();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;



    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Admin · Places</h1>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.updateButton}
                    onClick={handleGoogleUpdate}
                >
                    🔄 Update Google data
                </button>
                <button className={styles.updateButton} onClick={() => navigate("/admin/places/new")}>
                    ➕ Add new place
                </button>
            </div>




            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Reviews</th>
                    <th>Last update</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {places.map(p => (
                    <tr
                        key={p.google_place_id}
                        onClick={() =>
                            navigate(`/admin/places/${p.google_place_id}`)
                        }
                        style={{ cursor: "pointer" }}
                    >
                        <td>{p.name}</td>
                        <td>{p.rating}</td>
                        <td>{p.reviews_count}</td>
                        <td>{p.last_google_update}</td>

                        <td
                            onClick={async e => {
                                e.stopPropagation(); // ❗ ВАЖНО
                                await deletePlaceAdminRequest(p.google_place_id);
                                await loadPlaces();
                            }}
                            style={{
                                textAlign: "center",
                                cursor: "pointer"
                            }}
                        >
                            🗑️
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>
    );

};

export default AdminPlacesListPage;

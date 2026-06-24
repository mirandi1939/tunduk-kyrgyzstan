import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchPlaceAdminRequest,
    updatePlaceAdminRequest,
    uploadImageRequest,
} from "../../../api/adminApi";
import styles from "./PlaceEditPage.module.css";

const AdminPlaceEditPage = () => {
    const { googlePlaceId } = useParams();
    const navigate = useNavigate();

    const [place, setPlace] = useState(null);

    useEffect(() => {
        fetchPlaceAdminRequest(googlePlaceId).then(setPlace);
    }, [googlePlaceId]);

    const [uploadError, setUploadError] = useState("");

    if (!place) return <p>Loading...</p>;

    const handleSave = async () => {
        await updatePlaceAdminRequest(googlePlaceId, {
            name: place.name,
            description: place.description,
            region: place.region,
            image_path: place.image_path
        });

        navigate("/admin/places");
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Edit place</h2>

            <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                    className={styles.input}
                    value={place.name}
                    onChange={e =>
                        setPlace({ ...place, name: e.target.value })
                    }
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Region</label>
                <input
                    className={styles.input}
                    value={place.region || ""}
                    onChange={e =>
                        setPlace({ ...place, region: e.target.value })
                    }
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                    className={styles.textarea}
                    value={place.description || ""}
                    onChange={e =>
                        setPlace({ ...place, description: e.target.value })
                    }
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={async e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setUploadError("");
                        try {
                            const { image_path } = await uploadImageRequest(file);
                            setPlace(p => ({ ...p, image_path }));
                        } catch {
                            setUploadError("Image upload failed.");
                        }
                    }}
                />
                {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
                {place.image_path && (
                    <img
                        src={`${process.env.REACT_APP_API_URL || "http://localhost:5001"}${place.image_path}`}
                        alt="preview"
                        style={{ marginTop: 8, maxHeight: 120 }}
                    />
                )}
            </div>

            <div className={styles.actions}>
                <button className={styles.saveButton} onClick={handleSave}>
                    ✅ Save and exit
                </button>
            </div>
        </div>
    );

};

export default AdminPlaceEditPage;

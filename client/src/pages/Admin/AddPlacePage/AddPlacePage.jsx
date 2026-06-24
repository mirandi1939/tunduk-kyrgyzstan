import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPlaceAdminRequest, uploadImageRequest } from "../../../api/adminApi";
import styles from "./AddPlacePage.module.css";

const PLACE_TYPES = [
    { value: "mountain", label: "Mountain ⛰️" },
    { value: "lake", label: "Lake 🏞️" },
    { value: "waterfall", label: "Waterfall 💧" },
    { value: "valley", label: "Valley 🌄" },
    { value: "park", label: "Park 🌳" }
];

const AddPlacePage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        google_place_id: "",
        description: "",
        type: "",
        region: "",
        image_path: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await addPlaceAdminRequest(form);
            navigate("/admin/places");
        } catch (err) {
            setError("Failed to add place. Check Google Place ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Add new place</h2>

            <p className={styles.help}>
                Find Google Place ID here:{" "}
                <a
                    href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                    target="_blank"
                    rel="noreferrer"
                >
                    Google Place ID Finder
                </a>
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label>Google Place ID</label>
                    <input className={styles.input}
                        name="google_place_id"
                        required
                        value={form.google_place_id}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label>Type</label>
                    <select className={styles.select}
                        name="type"
                        required
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="">Select type</option>
                        {PLACE_TYPES.map(t => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Region</label>
                    <input className={styles.input}
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label>Description</label>
                    <textarea className={styles.textarea}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async e => {
                            const file = e.target.files[0];
                            if (!file) return;
                            try {
                                const { image_path } = await uploadImageRequest(file);
                                setForm(f => ({ ...f, image_path }));
                            } catch {
                                setError("Image upload failed.");
                            }
                        }}
                    />
                    {form.image_path && (
                        <img
                            src={`${process.env.REACT_APP_API_URL || "http://localhost:5001"}${form.image_path}`}
                            alt="preview"
                            style={{ marginTop: 8, maxHeight: 120 }}
                        />
                    )}
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.actions}>
                    <button disabled={loading} className={styles.button}>
                        ➕ Add place
                    </button>
                    <button className={styles.button}
                        type="button"
                        onClick={() => navigate("/admin/places")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPlacePage;

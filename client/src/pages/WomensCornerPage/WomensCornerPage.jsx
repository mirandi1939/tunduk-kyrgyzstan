import { useEffect, useState } from "react";
import { fetchWomensInfoRequest } from "../../api/womensApi";
import styles from "./WomensCornerPage.module.css";

const CATEGORY_LABELS = { safety: "Safety", dress_code: "Dress Code", transport: "Transport", accommodation: "Accommodation", health: "Health" };

const WomensCornerPage = () => {
    const [info, setInfo] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchWomensInfoRequest()
            .then(data => { setInfo(data); if (data.length > 0) setSelected(data[0].category); })
            .catch(() => setError("Failed to load information."));
    }, []);

    const categories = [...new Set(info.map(i => i.category))];
    const current = info.filter(i => i.category === selected);

    return (
        <div className={styles.page}>
            <div className={styles.banner}>
                <div className={styles.bannerInner}>
                    <h1 className={styles.bannerTitle}>Women's Corner</h1>
                    <p className={styles.bannerSub}>
                        Female-specific safety information, cultural guidance, and practical tips for women travelling in Kyrgyzstan.
                    </p>
                </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.body}>
                <nav className={styles.sidebar}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.navBtn} ${selected === cat ? styles.navActive : ""}`}
                            onClick={() => setSelected(cat)}
                        >
                            {CATEGORY_LABELS[cat] || cat}
                        </button>
                    ))}
                </nav>

                <div className={styles.content}>
                    {current.map(item => {
                        const tips = JSON.parse(item.tips || "[]");
                        return (
                            <div key={item.id} className={styles.card}>
                                <h2 className={styles.cardTitle}>{item.title}</h2>
                                <p className={styles.cardContent}>{item.content}</p>
                                {tips.length > 0 && (
                                    <div className={styles.tips}>
                                        <h3>Key tips</h3>
                                        <ul className={styles.tipList}>
                                            {tips.map((tip, i) => <li key={i} className={styles.tip}>{tip}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.operatorCta}>
                <h3>Prefer a women-only tour?</h3>
                <p>KG Women Expeditions offers female-led tours designed specifically for women travellers.</p>
                <a href="/operators" className={styles.ctaBtn}>View Women-Friendly Operators →</a>
            </div>
        </div>
    );
};

export default WomensCornerPage;

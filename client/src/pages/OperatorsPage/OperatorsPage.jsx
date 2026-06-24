import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOperatorsRequest } from "../../api/operatorsApi";
import styles from "./OperatorsPage.module.css";

const OperatorsPage = () => {
    const [operators, setOperators] = useState([]);
    const [womenOnly, setWomenOnly] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const filters = womenOnly ? { women_friendly: "1" } : {};
        fetchOperatorsRequest(filters)
            .then(setOperators)
            .catch(() => setError("Failed to load operators."));
    }, [womenOnly]);

    return (
        <div className={styles.page}>
            <div className={styles.pageHead}>
                <p className={styles.overline}>Verified professionals</p>
                <h1 className={styles.title}>Local Operators</h1>
                <p className={styles.sub}>Verified English-speaking local operators with direct contact information and traveler ratings.</p>
            </div>

            <div className={styles.filters}>
                <button
                    className={`${styles.filterBtn} ${womenOnly ? styles.filterActive : ""}`}
                    onClick={() => setWomenOnly(w => !w)}
                >
                    Women-friendly only
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.grid}>
                {operators.map(op => {
                    const langs = JSON.parse(op.languages || "[]");
                    return (
                        <div key={op.id} className={styles.card} onClick={() => navigate(`/operators/${op.id}`)}>
                            <div className={styles.cardTop}>
                                <div>
                                    <h2 className={styles.name}>{op.name}</h2>
                                    <span className={styles.specialty}>{op.specialty}</span>
                                </div>
                                <div className={styles.badges}>
                                    {op.is_verified ? <span className={styles.verified}>Verified</span> : null}
                                    {op.is_women_friendly ? <span className={styles.womenBadge}>Women-friendly</span> : null}
                                </div>
                            </div>
                            <div className={styles.rating}>{op.rating} <span>({op.reviews_count} reviews)</span></div>
                            <p className={styles.desc}>{op.description.slice(0, 140)}…</p>
                            <div className={styles.footer}>
                                <div className={styles.langs}>
                                    {langs.map(l => <span key={l} className={styles.lang}>{l}</span>)}
                                </div>
                                <span className={styles.region}>{op.region}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OperatorsPage;
